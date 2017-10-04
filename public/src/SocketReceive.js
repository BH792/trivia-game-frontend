const SocketReceive = (function SocketReceive() {
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

  function renderQuestion(json) {
    let question = new Question(json)
    options.innerHTML = ''
    results.innerHTML = ''
    currentQuestion = question
    questionDiv.innerHTML = `<h2> ${currentQuestion.question} </h2>`
    currentQuestion.choices.forEach( choice => {
      let button = document.createElement('button')
      button.className = 'btn btn-outline-primary answer-btn'
      button.innerHTML = choice
      button.addEventListener('click', SocketSend.checkAnswer)
      options.appendChild(button)
    })
  }

  function renderResult(json) {
    let p = document.createElement('p')
    p.innerText = json.result
    results.appendChild(p)
  }

  function renderGame(json) {
    appState.playState()
    document.querySelector('#game-code-header').innerText = json.gameCode
    if (json.users.length > 1) {
      document.querySelector('#start-game').disabled = false
    }

    renderLobby(json)
  }

  return {
    renderLobby: renderLobby,
    question: renderQuestion,
    broadcastResult: renderResult,
    sendGame: renderGame
  }
})()
