require('dotenv').config();

var { Client } = require('pg');

const client = new Client();
client.connect();

console.log('doin stuff');


const createUsers = `
  DROP TABLE IF EXISTS users;
  CREATE TABLE users (
    id int PRIMARY KEY,
    name varchar(50),
    email varchar
  );
`;

const seedUsers = `
  INSERT INTO users (id, name, email) VALUES (1, 'Todd', 'barry@fsfsddafsfsfdfsjfdslkfjdslkfjdsklfjsdlkfjs.com');
`;

run();

async function run() {
  var msg = await client.query(createUsers);
  console.log(msg);
  var msg = await client.query(seedUsers);
  console.log(msg);
}

