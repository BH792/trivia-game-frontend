const express = require('express');
const router = express.Router();
const https = require('https');

const triviaURL = 'https://opentdb.com/api.php?';

router.get('/', function(req, res){
  https.get(triviaURL + "amount=1", resp => {
    resp.setEncoding("utf8");
    let body = "";
    resp.on("data", data => {
      body += data;
    });
    resp.on("end", () => {
      body = JSON.parse(body);
      res.json(body);
    });
  });
});

// router.get('/game/:gameid', function game(req, res) {
//   let gameID = req.params.gameid;
//   rPub.publish(gameID, 'playState')
//   let randCats = randomInt.getFiveRandUniqInts(9, 32)
//   randCats.forEach((cat)=>{
//     https.get(triviaURL + "amount=5" + `&category=${cat}`, resp => {
//       resp.setEncoding("utf8");
//       let body = "";
//       resp.on("data", data => {
//         body += data;
//       });
//       resp.on("end", () => {
//         let category = JSON.parse(body).results[0].category
//         console.log(category)
//         rPub.hmset([gameID, category, body])
//         rPub.publish(gameID, category)
//       });
//     })
//   });
//   res.send('done');
// })

module.exports = router;
