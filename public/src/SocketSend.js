const SocketSend = (function SocketSend() {
  function getQuestion() {
    let json = {
      header: 'getQuestion',
      gameCode: document.querySelector('#game-code-header').innerText
    }
    socket.send(JSON.stringify(json))
  }

  function checkAnswer() {
    let result = this.innerHTML === currentQuestion.answer ? `${username} is Correct!` : `${username} is Wrong!`
    document.querySelectorAll('.answer-btn').forEach(btn => {btn.disabled = true})
    let json = {
      header: 'sendAnswer',
      result: result,
      gameCode: document.querySelector('#game-code-header').innerText
    }
    socket.send(JSON.stringify(json))
  }

  function connect(e) {
    e.preventDefault()
    username = e.target[0].value
    socket = new WebSocket(wsurl + '/' + username)
    socket.addEventListener('message', SocketReceiveRouter)

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

  function createGame(e) {
    socket.send(JSON.stringify({header: 'createGame'}))
  }

  function startGame() {
    socket.send(JSON.stringify({header: 'startGame'}))
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

  return {
    getQuestion: getQuestion,
    checkAnswer: checkAnswer,
    connect: connect,
    createGame: createGame,
    startGame: startGame,
    joinGame: joinGame
  }
})()
