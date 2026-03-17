require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, 'dev.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'src/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'src/db/seeds'),
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.join(__dirname, 'src/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'src/db/seeds'),
    },
  },
};
