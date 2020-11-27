require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var { Client } = require('pg');

const client = new Client();
client.connect();

// app.use(express.static('assets'))
app.use(function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ a: 1 });
});

app.get('/db', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    const results = { 'results': (result) ? result.rows : null };
    res.send(results);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log('listening on *:' + port);
});
