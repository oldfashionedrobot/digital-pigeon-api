require('dotenv').config();
const { uniqueNamesGenerator, Config, names } = require('unique-names-generator');
const txtgen = require('txtgen');

const nameGenConfig = {
  dictionaries: [names]
}

var { Client } = require('pg');

let client;

if (process.env.DATABASE_URL) {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  client = new Client();
}

client.connect();

console.log('doin stuff');

const createUsers = `
  DROP TABLE IF EXISTS users;
  CREATE TABLE users (
    id int GENERATED ALWAYS AS IDENTITY,
    username varchar(100),
    email varchar
  );
`;

const seedUsers = `
  INSERT INTO users (username, email) 
  VALUES 
  ('Billy', 'billy@hotmail.com'),
  ('Marvin', 'marvin@yahoo.com'),
  ('Serge', 'serge@gmail.com'),
  ('Kimiko', 'kimiko@aol.com'),
  ('Hughie', 'hughie@gmail.com'),
  ('Annie', 'annie@gmail.com');
`;

const createMessages = `
  DROP TABLE IF EXISTS messages;
  CREATE TABLE messages (
    id int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    from_id int,
    to_id int,
    pigeon_id int,
    message text,
    archived boolean DEFAULT FALSE
  );
`;

const seedMessages = `
    INSERT INTO messages (from_id, to_id, pigeon_id, message, archived)
    VALUES
    (4, 1, 2, '${txtgen.sentence()}', false),
    (2, 1, 3, '${txtgen.sentence()}', false),
    (5, 1, 4, '${txtgen.sentence()}', false),
    (5, 2, 27, '${txtgen.sentence()}', true),
    (5, 4, 27, '${txtgen.sentence()}', true);
`;

const createPigeons = `
  DROP TABLE IF EXISTS pigeons;
  CREATE TABLE pigeons (
    id int GENERATED ALWAYS AS IDENTITY,
    owner_id int,
    current_user_id int,
    name varchar(100),
    variant int,
    message_id int
  );
`;

const pigeonVals = [1, 2, 3, 4, 5, 6].map(userId => {
  let messageId = null;


  return Array(5).fill().map((_, idx) => {
    if (userId === 1 && (idx >= 1 && idx <= 3)) {
      messageId = idx;
    } else {
      messageId = 'NULL';
    }
    return {
      ownerId: userId,
      currentUserId: userId,
      name: uniqueNamesGenerator(nameGenConfig),
      variant: Math.floor(Math.random() * Math.floor(9)),
      messageId
    }
  });
}).flat().map(p => `(${p.ownerId}, ${Math.random() > 0.66 ? 1 : p.currentUserId}, '${p.name}', ${p.variant}, ${p.messageId})`).join(',');

const seedPigeons = `
  INSERT INTO pigeons (owner_id, current_user_id, name, variant, message_id)
  VALUES ${pigeonVals};
`;

console.log(seedPigeons);

run().then(r => process.exit());

async function run() {
  var msg = await client.query(createUsers);
  var msg = await client.query(seedUsers);
  var msg = await client.query(createPigeons);
  var msg = await client.query(seedPigeons);
  var msg = await client.query(createMessages);
  var msg = await client.query(seedMessages);
}

