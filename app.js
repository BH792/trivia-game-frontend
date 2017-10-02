const express = require('express');
const https = require('https');
const cors = require('cors');
const SocketServer = require('ws').Server;
const cookieParser = require('cookie-parser')
const redis = require('redis')

const rPub = redis.createClient();
const rSub = redis.createClient();

const app = express();
const router = express.Router();
const port = 3000;

const triviaURL = 'https://opentdb.com/api.php?';

app.use( express.static( __dirname + '/public' ));

router.get('/question', function(req, res){
  https.get(triviaURL + "amount=1", resp => {
    resp.setEncoding("utf8");
    let body = "";
    resp.on("data", data => {
      body += data;
    });
    resp.on("end", () => {
      body = JSON.parse(body);
      res.json(body);
    });
  });
});

router.get('/', function(req, res) {
  res.sendFile('/public/index.html', {root: __dirname })
})

app.use(cors());
// app.use(cookieParser('this-is-a-super-secret-secret'))
app.use('/', router)

const server = app.listen(port, () => console.log('Listening on Port: ', port));

const wss = new SocketServer({
  server: server,
  clientTracking: true
});

rSub.on('message', function broadcast(channel, msg) {
  this.clients.forEach(client => {
    if (client.channel = channel) {
      client.send(msg)
    }
  })
}.bind(wss));

const wsRouter = {
  getQuestion: getQuestion,
  sendLobby: sendLobby.bind(wss),
  sendAnswer: broadcastResult,
  createGame: createGame
};

function getQuestion() {
  https.get(triviaURL + "amount=1", resp => {
    resp.setEncoding("utf8");
    let body = "";
    resp.on("data", data => {
      body += data;
    });
    resp.on("end", () => {
      let jsonRes = JSON.parse(body).results[0];
      jsonRes.header = 'question';
      rPub.publish('test-game', JSON.stringify(jsonRes));
    });
  });
}

function sendLobby(data, ws) {
  let json = {
    header: 'renderLobby',
    users: []
  }
  this.clients.forEach(client => {
    if (client.channel === 'lobby') {
      json.users.push(client.user)
    }
  })
  rPub.publish('lobby', JSON.stringify(json))
}

function broadcastResult(data) {
  data.header = 'broadcastResult';
  rPub.publish('test-game', JSON.stringify(data));
}

function createGame(data, ws) {
  let gameCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0,5).toUpperCase()

}

rSub.subscribe('lobby');
wss.on('connection', function(ws, req) {
  console.log('Client connected');
  ws.user = req.url.slice(1, req.url.length);
  ws.channel = 'lobby'

  wsRouter.sendLobby()

  ws.on('message', function routing(data) {
    let dataJSON = JSON.parse(data)
    if (wsRouter[dataJSON.header]) {
      (wsRouter[dataJSON.header])(dataJSON, this)
    }
  })

  ws.on('close', function disconnect() {
    wsRouter.sendLobby()
    console.log('Client disconnected')
  }.bind(this));
});
