const db = require('../db');

class GroupSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      )
    `, []);
  }

  create(name) {
    this.db.run(`INSERT INTO groups(name) VALUES(?)`, [name],
      function(err) {
        if (err) throw err;
        callback(this.lastID);
      }
    );
  }
}

module.exports = new GroupSchema();