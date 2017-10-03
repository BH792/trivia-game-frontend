class Question {
  constructor(data) {
    this.question = data.question
    this.answer = data.correct_answer
    this.choices =  this.shuffle(data.incorrect_answers.concat([data.correct_answer]))
  }

  shuffle(array) {
    let shuffedArray = []
    let rand = Math.round(Math.random() * (array.length -1 ))
    shuffedArray = array.slice(rand).concat(array.slice(0, rand))
    return shuffedArray
  }
}

function test() {
  console.log(results);
}
