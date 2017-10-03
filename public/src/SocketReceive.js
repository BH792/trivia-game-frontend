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
      b.innerText = "Start Game"
      b.addEventListener('click', SocketSend.getQuestion)
      document.body.appendChild(b)
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
