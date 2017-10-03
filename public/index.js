document.querySelector('#username').addEventListener('submit',connect)
let questionDiv = document.querySelector('#question')
let options = document.querySelector('#options')
let userLobby = document.querySelector('#user-lobby')
let results = document.querySelector('#results')

let socket;
let username;
let currentQuestion;
const url = 'http://localhost:3000'
const wsurl = 'ws://localhost:3000'

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


function SocketReceiveRouter(msgEvent) {
  let dataJSON = JSON.parse(msgEvent.data)
  console.log(dataJSON.header);
  if (SocketReceive[dataJSON.header]) {
    (SocketReceive[dataJSON.header])(dataJSON)
  }
}
