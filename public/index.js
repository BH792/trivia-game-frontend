window.onload = function() {
  document.querySelector('#create-game').addEventListener('click', SocketSend.createGame)
  document.querySelector('#join-game').addEventListener('submit', SocketSend.joinGame)
  document.querySelector('#username').addEventListener('submit',connect)
  document.querySelector('#start-game').addEventListener('click', SocketSend.startGame)
  document.querySelector('#game-question-board-buttons').addEventListener('click', SocketSend.getQuestion);
}

let questionQuestion = document.querySelector('#question-question')
let questionOptions = document.querySelector('#question-options')
let userLobby = document.querySelector('#user-lobby')
let questionResults = document.querySelector('#question-results')

let socket;
let username;
let currentQuestion;
const url = 'http://192.168.3.106:3000'
const wsurl = 'ws://192.168.3.106:3000'

function connect(e) {
  e.preventDefault()
  username = e.target[0].value
  socket = new WebSocket(wsurl + '/' + username)
  socket.addEventListener('message', SocketReceiveRouter)
  appState.connectedState(e);
}

function checkAnswer() {
  let result = this.innerHTML === currentQuestion.answer ? `${username} is Correct!` : `${username} is Wrong!`
  alert(result)
}

function showQuestion(question) {
  questionOptions.innerHTML = ""
  currentQuestion = question
  questionQuestion.innerHTML = `<h2> ${currentQuestion.question} </h2>`
  currentQuestion.choices.forEach( choice => {
    let button = document.createElement('button')
    button.className = "btn btn-outline-primary"
    button.innerHTML = choice
    button.addEventListener('click', checkAnswer)
    questionOptions.appendChild(button)
  })
}

function getQuestion() {
  fetch(url + '/question')
    .then(res => res.json())
    .then(json => new Question(json.results[0]))
    .then(question => showQuestion(question))
}


function SocketReceiveRouter(msgEvent) {
  let dataJSON = JSON.parse(msgEvent.data)
  console.log(dataJSON);
  if (SocketReceive[dataJSON.header]) {
    (SocketReceive[dataJSON.header])(dataJSON)
  }
}
