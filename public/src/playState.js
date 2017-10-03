const appState = (function appState(){

  function connectedState(e){
    let b = document.createElement('button')
    b.id = 'create-game'
    b.className = "btn btn-outline-danger margin"
    b.innerText = "Create Game"
    b.addEventListener('click', SocketSend.createGame)
    document.body.appendChild(b)

    let form = document.createElement('form')
    form.addEventListener('submit', SocketSend.joinGame)
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

  function playState(){
    let display = document.getElementById('display');
    display.innerHTML = "";
  }
  return {
    connectedState: connectedState,
    playState: playState
  }
})();
