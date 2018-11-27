const sqlite3 = require('sqlite3');

class Database {
  constructor() {
    this.db = new sqlite3.Database('./db/tasker.sqlite3', err => {
      if (err) {
        console.log('Could not connect to database');
      } else {
        console.log('Connected to database');
      }
    });

    this.db.run(`PRAGMA foreign_keys = ON`, []);
  }

  run(sql, params, callback) {
    this.db.run(sql, params,
      function (err) {
        if (err) throw err;
        if (callback) callback(this.lastID);
      }
    );
  }

  get(sql, params, callback) {
    this.db.get(sql, params,
      function (err, row) {
        if (err) throw err;
        if (callback) callback(row);
      }
    );
  }

  all(sql, params, callback) {
    this.db.all(sql, params,
      function (err, rows) {
        if (err) throw err;
        if (callback) callback(rows);
      }
    );
  }
}

module.exports = new Database();