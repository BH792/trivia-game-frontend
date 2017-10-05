const SocketSend = (function SocketSend() {

  function getQuestion(event) {
    let questionNumber = parseInt(event.target.parentNode.parentNode.dataset.row)
    let rowNum = parseInt(event.target.dataset.col)
    let tableHeader = document.getElementById('game-question-board-categories');
    let catName = tableHeader.children[rowNum].innerText
    let json = {
      header: 'getQuestion',
      gameCode: document.querySelector('#game-code-header').innerText,
      category: catName,
      questionNumber: questionNumber
    }
    socket.send(JSON.stringify(json))
  }

  function checkAnswer(event) {
    let questionCode = event.currentTarget.parentElement.parentElement.children[0].dataset.id
    let questionAnswer = event.currentTarget.parentElement.dataset.answer;
    let clickedAnswer = btoa(unescape(encodeURIComponent(event.currentTarget.innerText)))
    let questionDifficulty = event.currentTarget.parentElement.parentElement.children[0].dataset.difficulty

    let json = {
      header: 'sendQuestionAnswer',
      result: (questionAnswer == clickedAnswer),
      questionCode: questionCode,
      difficulty: questionDifficulty,
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

  function startGame() {
    let gameCode = document.querySelector('#game-code-header').innerText;
    socket.send(JSON.stringify({header: 'startGame', gameCode: gameCode}));
  }

  return {
    getQuestion: getQuestion,
    checkAnswer: checkAnswer,
    createGame: createGame,
    startGame: startGame,
    joinGame: joinGame
  }
})()
