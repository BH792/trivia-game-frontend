class randomInt {
  static getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getFiveRandUniqInts(min, max){
    let randArray = [];
    for (let i = 0; i<5; i++){
      while(randArray.length < 5){
        let j = randomInt.getRandomIntInclusive(min, max);
        if (!randArray.includes(j)) {
          randArray.push(j)
        }
      }
    }
    return randArray;
  }
}

module.exports = randomInt
