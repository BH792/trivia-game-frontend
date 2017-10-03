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

module.exports = router;
