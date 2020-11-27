require('dotenv').config();
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);
var { Client } = require('pg');

const client = new Client();
client.connect();

// app.use(express.static('assets'))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json');
  next();
});
app.use(bodyParser.json());

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

app.put('/pigeons/:pigeonId/read', async (req, res) => {
  try {
    const result = await client.query(`UPDATE pigeons SET message_id = NULL WHERE id = ${req.params['pigeonId']}`);
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

app.post('/give-pigeon', async (req, res) => {
  try {
    const pigeonId = req.body['pigeonId'];
    const recipientId = req.body['recipientId'];

    const result = await client.query(`UPDATE pigeons SET current_user_id = ${recipientId} WHERE id = ${pigeonId};`);
    res.status(200).send(true);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
})

app.post('/send-message', async (req, res) => {
  try {
    const pigeonId = req.body['pigeonId'];
    const message = req.body['message'];

    const result = await client.query(`SELECT owner_id, current_user_id FROM pigeons WHERE id = ${pigeonId}`);
    const ownerId = result.rows[0]['owner_id'];
    const currentUserId = result.rows[0]['current_user_id'];

    const msgResult = await client.query(`
      INSERT INTO messages (from_id, to_id, pigeon_id, message)
      VALUES (${currentUserId}, ${ownerId}, ${pigeonId}, '${message}')
      RETURNING id;
    `);

    const result2 = await client.query(`UPDATE pigeons SET current_user_id = ${ownerId}, message_id = ${msgResult.rows[0].id} WHERE id = ${pigeonId};`);

    const resp = { 'data': (msgResult) ? msgResult.rows : null };

    res.status(200).send(resp);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
})

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
