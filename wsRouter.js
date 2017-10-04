const https = require('https')
const randomInt = require('./randomInt')
const triviaURL = 'https://opentdb.com/api.php?';

class wsRouter {
  constructor(rPub, rSub, wss) {
    this.rPub = rPub;
    this.rSub = rSub;
    this.wss = wss
  }

  getQuestion(data) {
    console.log('getting question from redis')
    let gameCode = data.gameCode;
    let category = data.category;
    this.rPub.hget(gameCode, category, (err, reply) => {
      let questionsJSON = JSON.parse(reply);
      let json = questionsJSON.results[data.questionNumber]
      json.header = 'renderQuestion'
      json.buttonID = [category, data.questionNumber]
      this.rPub.publish(gameCode, JSON.stringify(json));
    })
  }

  sendLobby(data, ws) {
    let json = {
      header: 'renderLobby',
      users: []
    }
    this.wss.clients.forEach(client => {
      if (client.channel === 'lobby') {
        json.users.push(client.user)
      }
    })
    this.rPub.publish('lobby', JSON.stringify(json))
  }

  broadcastResult(data) {
    data.header = 'broadcastResult';
    this.rPub.publish(data.gameCode, JSON.stringify(data));
  }

  createGame(data, ws) {
    let gameCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0,5).toUpperCase()
    ws.channel = gameCode
    this.rSub.subscribe(gameCode)
    let json = {
      header: 'sendGame',
      gameCode: gameCode,
      users: [ws.user]
    }
    ws.send(JSON.stringify(json))
    this.sendLobby()
  }

  joinGame(data, ws) {
    // TODO: check this gameCode exists
    let gameCode = data.gameCode
    ws.channel = gameCode
    let json = {
      header: 'sendGame',
      gameCode: gameCode,
      users: []
    }
    this.wss.clients.forEach(client => {
      if (client.channel === gameCode) {
        json.users.push(client.user)
      }
    })
    this.rSub.subscribe(gameCode)
    this.rPub.publish(gameCode, JSON.stringify(json))
    this.sendLobby()
  }

  startGame(data) {
    let gameCode = data.gameCode;
    this.rPub.publish(gameCode, JSON.stringify({header: 'showTable'}))
    let randCats = randomInt.getFiveRandUniqInts(9, 32)
    randCats.forEach((cat)=>{
      https.get(triviaURL + 'amount=5' + `&category=${cat}`, resp => {
        resp.setEncoding('utf8');
        let body = '';
        resp.on('data', data => {
          body += data;
        });
        resp.on('end', () => {
          let fullCategory = JSON.parse(body).results[0].category
          let category;
          if (fullCategory.match(/:/)) {
            category = fullCategory.split(": ")[1]
          } else {
            category = fullCategory
          }
          console.log(category)
          this.rPub.hmset([gameCode, category, body])
          this.rPub.publish(gameCode, JSON.stringify({
            header: 'gameCategory',
            category: category
          }))
        });
      })
    });
  }
}

module.exports = wsRouter
