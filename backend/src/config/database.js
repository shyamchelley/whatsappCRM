const knex = require('knex');
const knexConfig = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const config = knexConfig[env];

const db = knex(config);

// Enable foreign keys for SQLite
if (env === 'development') {
  db.raw('PRAGMA foreign_keys = ON').catch(() => {});
}

module.exports = db;
