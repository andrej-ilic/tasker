const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db/tasker.sqlite3', (err) => {
  if (err) {
    console.log('Could not connect to database');
  } else {
    console.log('Connected to database');
  }
});

db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON`, []);
});

module.exports = db;