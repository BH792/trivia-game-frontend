const appState = (function appState(){
  function clearScreen() {
    Array.from(document.body.children).forEach(child => {child.style.display = 'none'})
  }

  function connectedState(e){
    clearScreen()
    document.querySelector('#connectedState').style.display = 'block'
  }

  function gameLobbyState() {
    clearScreen()
    document.querySelector('#gameLobbyState').style.display = 'block'
  }

  function playState(){
    clearScreen()
    document.querySelector('#playState').style.display = 'block'
  }

  return {
    connectedState: connectedState,
    gameLobbyState: gameLobbyState,
    playState: playState
  }
})();
