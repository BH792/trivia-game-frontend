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
    createGame: createGame,
    startGame: startGame,
    joinGame: joinGame
  }
})()
