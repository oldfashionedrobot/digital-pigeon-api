var express = require('express');
var app = express();
var http = require('http').createServer(app);

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

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log('listening on *:' + port);
});