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
    let row = document.querySelector(`tr[data-row="${json.buttonID[1]}"]`).dataset.row
    let catArr = Array.from(document.querySelector('#game-question-board-categories').children)
    let col = catArr.indexOf(catArr.find(node => {return node.innerText === json.buttonID[0]}))
    document.querySelector(`#r${row}-c${col}`).disabled = true
    let question = new Question(json)
    let hashedAnswer = btoa(unescape(encodeURIComponent(question.answer)))
    questionOptions.dataset.answer = hashedAnswer;
    questionOptions.innerHTML = ''
    questionResults.innerHTML = ''
    questionQuestion.innerHTML = `<h2> ${question.question} </h2>`
    questionQuestion.dataset.id = `r${row}-c${col}`
    questionQuestion.dataset.difficulty = json.difficulty
    question.choices.forEach(choice => {
      let button = document.createElement('button')
      button.className = 'btn btn-outline-primary answer-btn'
      button.innerHTML = choice
      button.addEventListener('click', SocketSend.checkAnswer)
      questionOptions.appendChild(button)
    })
  }

  function renderResult(json) {
    let p = document.createElement('p')
    p.innerText = json.result
    questionResults.appendChild(p)
  }

  function renderGameLobby(json) {
    appState.gameLobbyState()
    document.querySelector('#game-code-header').innerText = json.gameCode
    let gameLobby = document.querySelector('#game-lobby')

    let currentUsers = {}
    for (var i = 0; i < gameLobby.children.length; i++) {
      currentUsers[gameLobby.children[i].innerText] = true
    }

    json.users.forEach(user => {
      if (!currentUsers[user]) {
        let li = document.createElement('li')
        li.innerText = user
        gameLobby.appendChild(li)
      }
    })

    if (gameLobby.children.length > 1) {
      document.querySelector('#start-game').disabled = false
    }
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

  function startGame(json) {
    let playerOneName = document.querySelector('#game-lobby').children[0].innerText
    let playerTwoName = document.querySelector('#game-lobby').children[1].innerText

    document.querySelector('#playerOneName').innerHTML = playerOneName;
    document.querySelector('#playerTwoName').innerHTML = playerTwoName;

    appState.playState()
  }

  function renderQuestionResults(json) {
    let results = document.querySelector('#question-options')

    let playerOneName = document.querySelector('#playerOneName').innerText
    let playerTwoName = document.querySelector('#playerTwoName').innerText
    let playerOneScore = document.querySelector('#playerOneScore')
    let playerTwoScore = document.querySelector('#playerTwoScore')
    let answer = atob(document.querySelector('#question-options').dataset.answer)

    if (!json.result) {
      if (playerOneName !== json.user) {
        playerOneScore.innerHTML = parseInt(playerOneScore.innerHTML) + (json.points/2)
      } else {
        playerTwoScore.innerHTML = parseInt(playerTwoScore.innerHTML) + (json.points/2)
      }
      socket.send(JSON.stringify({
        header: 'addPoints',
        points: (json.points/2),
        gameCode: json.gameCode,
        user: json.user
      }))
    } else{
      if (playerOneName === json.user) {
        playerOneScore.innerHTML = parseInt(playerOneScore.innerHTML) + json.points
      } else {
        playerTwoScore.innerHTML = parseInt(playerTwoScore.innerHTML) + json.points
      }

    }

    checkGameOver()
    results.innerHTML = `${json.user} was ${json.result ? 'correct' : 'wrong'}, the answer was ${answer}! This question was worth ${json.points}`
  }

  return {
    renderLobby: renderLobby,
    renderQuestion: renderQuestion,
    broadcastResult: renderResult,
    sendGame: renderGameLobby,
    gameCategory: gameCategory,
    startGame: startGame,
    sendQuestionResults: renderQuestionResults
  }
})()
