const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

const db = () => {
  try {
    console.log('Database online');
    return drizzle(client);
  } catch (error) {
    console.error('Error initializing the database', error);
    throw new Error('Error initializing the database');
  }
};

module.exports = { db };