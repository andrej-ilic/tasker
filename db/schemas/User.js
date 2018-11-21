const db = require('../db');
const PersonalGroup = require('../schemas/PersonalGroup');

class UserSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personalGroupId INTEGER,
        name TEXT,
        username TEXT,
        hash TEXT
      )
    `, []);
  }

  create(userData, callback) {
    this.db.run(`INSERT INTO users(name, username, hash) VALUES(?, ?, ?)`, [userData.name, userData.username, userData.hash],
      function(err) {
        if (err) throw err;
        userData.id = this.lastID;
        PersonalGroup.create(userData.id, userData.name + '\'s tasks', 
          personalGroupId => {
            const User = require('./User');
            User.setPersonalGroupId(userData.id, personalGroupId);
          });
        callback(this.lastID);
      }
    );
  }

  getUserByUsername(username, callback) {
    this.db.get(`SELECT * FROM users WHERE username = ?`, [username],
      function(err, row) {
        if (err) throw err;
        callback(row);
      }
    );
  }

  setPersonalGroupId(userId, personalGroupId) {
    this.db.run(`UPDATE users SET personalGroupId = ? WHERE id = ?`, [personalGroupId, userId]);
  }
}

module.exports = new UserSchema();