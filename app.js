const express = require('express');
const https = require('https');
const cors = require('cors');
const SocketServer = require('ws').Server;
const cookieParser = require('cookie-parser')
const redis = require('redis')

const rPub = redis.createClient();
const rSub = redis.createClient();

rSub.on('message', function broadcast(channel, msg) {
  if (LOBBY.length > 0) {
    LOBBY.forEach(user => user.send(msg))
  };
});

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

const wss = new SocketServer({server: server});
const LOBBY = [];
// const GAMES = {};
const wsRouter = {
  getQuestion: getQuestion,
  sendLobby: sendLobby,
  sendAnswer: broadcastResult,
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

function sendLobby() {
  if (LOBBY.length > 0) {
    let json = {
      header: 'renderLobby',
      users: []
    };
    LOBBY.forEach(ws => json.users.push(ws.user));
    LOBBY.forEach(ws => ws.send(JSON.stringify(json)));
  }
}

function broadcastResult(data) {
  data.header = 'broadcastResult';
  rPub.publish('test-game', JSON.stringify(data));
}

rSub.subscribe('test-game');
wss.on('connection', function(ws, req) {
  console.log('Client connected');
  ws.user = req.url.slice(1, req.url.length);
  ws.channels ? ws.channels.push('test-game') : ws.channels = ['test-game']
  LOBBY.push(ws);
  const index = LOBBY.indexOf(ws)

  wsRouter.sendLobby()

  ws.on('message', function routing(data) {
    let dataJSON = JSON.parse(data)
    if (wsRouter[dataJSON.header]) {
      (wsRouter[dataJSON.header])(dataJSON)
    }
  })

  ws.on('close', function disconnect() {
    LOBBY.splice(index, 1)
    wsRouter.sendLobby()
    console.log('Client ', index ,' disconnected')
  });
});
