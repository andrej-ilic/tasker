const db = require('../db');

class PersonalGroupSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS personalGroups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        name TEXT
      )
    `, []);
  }

  create(userId, name, callback) {
    this.db.run(`INSERT INTO personalGroups(userId, name) VALUES(?, ?)`, [userId, name],
      function(err) {
        if (err) throw err;
        callback(this.lastID);
      }
    );
  }
}

module.exports = new PersonalGroupSchema();