require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var { Client } = require('pg');

const client = new Client();
client.connect();

// app.use(express.static('assets'))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ a: 1 });
});


app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
})

app.get('/users/:userId', async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM users WHERE id = ${req.params['userId']}`);
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get('/pigeons', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM pigeons');
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
})

app.get('/pigeons/:pigeonId', async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM pigeons WHERE id = ${req.params['pigeonId']}`);
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});


app.get('/pigeons/user/:userId', async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM pigeons WHERE current_user_id = ${req.params['userId']}`);
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get('/messages', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM messages');
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
})

app.get('/messages/:messageId', async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM messages WHERE id = ${req.params['messageId']}`);
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get('/messages/user/:userId', async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM messages WHERE to_id = ${req.params['userId']}`);
    const results = { 'data': (result) ? result.rows : null };
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log('listening on *:' + port);
});
