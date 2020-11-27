require('dotenv').config();
var { uniqueNamesGenerator, Config, starWars } = require('unique-names-generator');

const nameGenConfig = {
  dictionaries: [starWars]
}

var { Client } = require('pg');

const client = new Client();
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
  ('Billy', 'billy@butcher.com'),
  ('Marvin', 'marvin@milk.com'),
  ('Serge', 'serge@frenchie.com'),
  ('Kimiko', 'kimiko@thefemale.com'),
  ('Hughie', 'hughie@campbell.com'),
  ('Annie', 'annie@january.com');
`;

const createMessages = `
  DROP TABLE IF EXISTS messages;
  CREATE TABLE messages (
    id int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    from_id int,
    to_id int,
    pigeon_id int,
    message text
  );
`;

const seedMessages = `
    INSERT INTO messages (from_id, to_id, pigeon_id, message)
    VALUES
    (4, 1, 12, 'fjlkdsjflskdjf lkf lkf djslkf jldkf s'),
    (2, 1, 3, ';jkjlkjk;lklkjhljlkjkljlkjlkjk'),
    (5, 1, 27, 'blueberry blueberry blueberry'),
    (5, 2, 27, 'bready bready bready'),
    (5, 4, 27, 'candycanes candycanes candycanes');
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
  return Array(5).fill().map((_) => {
    return {
      ownerId: userId,
      currentUserId: userId,
      name: uniqueNamesGenerator(nameGenConfig),
      variant: Math.floor(Math.random() * Math.floor(9))
    }
  });
}).flat().map(p => `(${p.ownerId}, ${Math.random() > 0.66 ? 1 : p.currentUserId}, '${p.name}', ${p.variant})`).join(',');

const seedPigeons = `
  INSERT INTO pigeons (owner_id, current_user_id, name, variant)
  VALUES ${pigeonVals};
`;

run().then(r => process.exit());

async function run() {
  var msg = await client.query(createUsers);
  var msg = await client.query(seedUsers);
  var msg = await client.query(createPigeons);
  var msg = await client.query(seedPigeons);
  var msg = await client.query(createMessages);
  var msg = await client.query(seedMessages);
}

