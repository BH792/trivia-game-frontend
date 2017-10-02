document.querySelector('#username').addEventListener('submit', wsConnect)
let questionDiv = document.querySelector('#question')
let options = document.querySelector('#options')
let userLobby = document.querySelector('#user-lobby')
let results = document.querySelector('#results')

let socket;
let username;
let currentQuestion;
const url = 'http://192.168.3.106:3000'
const wsurl = 'ws://192.168.3.106:3000'

function checkAnswer() {
  let result = this.innerHTML === currentQuestion.answer ? `${username} is Correct!` : `${username} is Wrong!`
  alert(result)
}

function showQuestion(question) {
  options.innerHTML = ""
  currentQuestion = question
  questionDiv.innerHTML = `<h2> ${currentQuestion.question} </h2>`
  currentQuestion.choices.forEach( choice => {
    let button = document.createElement('button')
    button.className = "btn btn-outline-primary"
    button.innerHTML = choice
    button.addEventListener('click', checkAnswer)
    options.appendChild(button)
  })
}

function getQuestion() {
  fetch(url + '/question')
    .then(res => res.json())
    .then(json => new Question(json.results[0]))
    .then(question => showQuestion(question))
}

function getQuestionWS() {
  socket.send(JSON.stringify({header: 'getQuestion'}))
}

function wsConnect(e) {
  e.preventDefault()
  username = e.target[0].value
  socket = new WebSocket(wsurl + '/' + username)
  socket.addEventListener('message', wsRouterClient)

  let b = document.createElement('button')
  b.className = "btn btn-outline-danger margin"
  b.innerText = "Get Question"
  b.addEventListener('click', getQuestionWS)
  document.body.appendChild(b)
  document.body.removeChild(e.currentTarget)
}

const wsRouter = {
  renderLobby: renderLobby,
  question: renderQuestion,
  broadcastResult: renderResult
}

function wsRouterClient(msgEvent) {
  let dataJSON = JSON.parse(msgEvent.data)
  if (wsRouter[dataJSON.header]) {
    (wsRouter[dataJSON.header])(dataJSON)
  }
}

function renderLobby(json) {
  userLobby.innerHTML = ''
  let users = json.users
  users.forEach(user => {
    let button = document.createElement('button')
    button.innerHTML = user
    button.addEventListener('click', createGame)
    userLobby.appendChild(button)
  })
}

function createGame(e) {
  socket.send(JSON.stringify({header: 'createGame'}))
}

function renderQuestion(json) {
  let question = new Question(json)
  options.innerHTML = ""
  currentQuestion = question
  questionDiv.innerHTML = `<h2> ${currentQuestion.question} </h2>`
  currentQuestion.choices.forEach( choice => {
    let button = document.createElement('button')
    button.className = "btn btn-outline-primary answer-btn"
    button.innerHTML = choice
    button.addEventListener('click', checkAnswerWS)
    options.appendChild(button)
  })
}

function renderResult(json) {
  let p = document.createElement('p')
  p.innerText = json.result
  results.appendChild(p)
}

function checkAnswerWS() {
  let result = this.innerHTML === currentQuestion.answer ? `${username} is Correct!` : `${username} is Wrong!`
  document.querySelectorAll('.answer-btn').forEach(btn => {btn.disabled = true})
  socket.send(JSON.stringify({header: 'sendAnswer', result: result}))
}
