const express = require('express');
const https = require('https');
const cors = require('cors');
const app = express();


const triviaURL = 'https://opentdb.com/api.php?'

app.use(cors())

app.get('/', function(req, res){
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

app.listen(3000);
