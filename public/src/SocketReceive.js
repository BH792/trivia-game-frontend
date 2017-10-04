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

  function gameCategory(json) {
    let category = json.category
    console.log(category)
    let cats = document.querySelector('#game-question-board-categories').children
    for (let i = 0; i < cats.length; i++) {
      if (cats[i].innerText === 'Category') {
        cats[i].innerText = category;
        break
      }
    }
  }

  function showTable(json) {
    document.querySelector('#game-question-board').style.display = 'block';
  }

  return {
    renderLobby: renderLobby,
    question: renderQuestion,
    broadcastResult: renderResult,
    sendGame: renderGame,
    gameCategory: gameCategory,
    showTable: showTable
  }
})()
