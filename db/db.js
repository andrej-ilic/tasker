const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./db/tasker.sqlite3', (err) => {
  if (err) {
    console.log('Could not connect to database');
  } else {
    console.log('Connected to database');
  }
});

module.exports = db;