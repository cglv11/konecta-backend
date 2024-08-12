const { drizzle } = require("drizzle-orm/node-postgres");
const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const dbConnection = async () => {
  try {
    await client.connect();
    console.log('Database online');
    return drizzle(client);
  } catch (error) {
    console.error('Error initializing the database', error);
    throw new Error('Error initializing the database');
  }
};

module.exports = { dbConnection };