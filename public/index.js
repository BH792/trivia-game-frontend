document.querySelector('#username').addEventListener('submit', wsConnect)
let questionDiv = document.querySelector('#question')
let options = document.querySelector('#options')
let userLobby = document.querySelector('#user-lobby')
let results = document.querySelector('#results')

let socket;
let username;
let currentQuestion;
const url = 'http://localhost:3000'
const wsurl = 'ws://localhost:3000'

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

function joinGame(e) {
  e.preventDefault()
  let gameCode = e.target[0].value
  let json = {
    header: 'joinGame',
    gameCode: gameCode
  }
  socket.send(JSON.stringify(json))
}

function wsConnect(e) {
  e.preventDefault()
  username = e.target[0].value
  socket = new WebSocket(wsurl + '/' + username)
  socket.addEventListener('message', wsRouterClient)

  let b = document.createElement('button')
  b.id = 'create-game'
  b.className = "btn btn-outline-danger margin"
  b.innerText = "Create Game"
  b.addEventListener('click', createGame)
  document.body.appendChild(b)

  let form = document.createElement('form')
  form.addEventListener('submit', joinGame)
  form.id = 'join-game'
  let input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'Enter Game Code'
  let submit = document.createElement('input')
  submit.type = 'submit'
  submit.value = 'Connect'
  form.appendChild(input)
  form.appendChild(submit)
  document.body.appendChild(form)
  document.body.removeChild(e.currentTarget)
}

const wsRouter = {
  renderLobby: renderLobby,
  question: renderQuestion,
  broadcastResult: renderResult,
  sendGame: renderGame
}

function wsRouterClient(msgEvent) {
  let dataJSON = JSON.parse(msgEvent.data)
  console.log(dataJSON.header);
  if (wsRouter[dataJSON.header]) {
    (wsRouter[dataJSON.header])(dataJSON)
  }
}

function renderLobby(json) {
  userLobby.innerHTML = ''
  let users = json.users
  users.forEach(user => {
    let p = document.createElement('p')
    p.innerHTML = user
    // button.addEventListener('click', createGame)
    userLobby.appendChild(p)
  })
}

function createGame(e) {
  socket.send(JSON.stringify({header: 'createGame'}))
}

function getQuestionWS() {
  let json = {
    header: 'getQuestion',
    gameCode: document.querySelector('#game-code-header').innerText
  }
  socket.send(JSON.stringify(json))
}

function renderQuestion(json) {
  debugger
  let question = new Question(json)
  options.innerHTML = ''
  results.innerHTML = ''
  currentQuestion = question
  questionDiv.innerHTML = `<h2> ${currentQuestion.question} </h2>`
  currentQuestion.choices.forEach( choice => {
    let button = document.createElement('button')
    button.className = 'btn btn-outline-primary answer-btn'
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
  let json = {
    header: 'sendAnswer',
    result: result,
    gameCode: document.querySelector('#game-code-header').innerText
  }
  socket.send(JSON.stringify(json))
}

function renderGame(json) {
  let createGame = document.querySelector('#create-game')
  let joinGame = document.querySelector('#join-game')
  let getQButton = document.querySelector('#get-question')
  if (createGame && joinGame) {
    document.body.removeChild(createGame)
    document.body.removeChild(joinGame)
    let codeH2 = document.createElement('h2')
    codeH2.id = 'game-code-header'
    codeH2.innerText = json.gameCode
    document.body.appendChild(codeH2)
  }
  if (json.users.length > 1 && !getQButton) {
    let b = document.createElement('button')
    b.id = 'get-question'
    b.className = "btn btn-outline-danger margin"
    b.innerText = "Get Question"
    b.addEventListener('click', getQuestionWS)
    document.body.appendChild(b)
  }

  renderLobby(json)
}
