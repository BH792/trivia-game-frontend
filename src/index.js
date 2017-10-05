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
const url = 'https://enigmatic-beyond-50418.herokuapp.com/'
const wsurl = 'ws://enigmatic-beyond-50418.herokuapp.com/'

function connect(e) {
  e.preventDefault()
  username = e.target[0].value
  socket = new WebSocket(wsurl + '/' + username)
  socket.addEventListener('message', SocketReceiveRouter)
  appState.connectedState(e);
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

function checkGameOver() {
  let questions = document.querySelectorAll('button.question-button:disabled')
  console.log('game over')
  if (questions.length === 25) {
    let playerOneScore = parseInt(document.querySelector('#playerOneScore').innerText)
    let playerTwoScore = parseInt(document.querySelector('#playerTwoScore').innerText)
    let playerOneName = document.querySelector('#playerOneName').innerText
    let playerTwoName = document.querySelector('#playerTwoName').innerText
    let message = 'Game Over, '
    playerOneScore > playerTwoScore ? message += playerOneName : message += playerTwoName
    alert(message + ' wins!')
  }
  console.log('game over')
}
