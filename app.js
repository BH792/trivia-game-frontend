const express = require('express');
const https = require('https');
const cors = require('cors');
const SocketServer = require('ws').Server;
const cookieParser = require('cookie-parser')
const redis = require('redis')
const questionRouter = require('./routes/question');

const rPub = redis.createClient(process.env.REDIS_URL);
const rSub = redis.createClient(process.env.REDIS_URL);

const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();

const triviaURL = 'https://opentdb.com/api.php?';

app.use( express.static( __dirname + '/public' ));

router.get('/', function(req, res) {
  res.sendFile('index.html', {root: __dirname })
})

app.use(cors());
app.use(cookieParser('this-is-a-super-secret-secret'))
app.use('/question', questionRouter)
app.use('/', router)

const server = app.listen(port, () => console.log('Listening on Port: ', port));

const wss = new SocketServer({
  server: server,
  clientTracking: true
});

rSub.on('message', function broadcast(channel, msg) {
  this.clients.forEach(client => {
    console.log(channel, client.channel, client.user);
    if (client.channel === channel) {
      client.send(msg)
    }
  })
}.bind(wss));

const SocketRouter = require('./wsRouter')
const wsRouter = new SocketRouter(rPub, rSub, wss)

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
