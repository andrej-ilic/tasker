const db = require('../db');
const Group = require('../schemas/Group');
const UserGroup = require('../schemas/UserGroup');

class UserSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id         INTEGER   PRIMARY    KEY AUTOINCREMENT,
        name       TEXT      NOT NULL,
        username   TEXT      NOT NULL   UNIQUE,
        password   TEXT      NOT NULL,
        biography  TEXT      DEFAULT ''
      )
    `, []);
  }

  create(name, username, password, callback) {
    this.db.run(`INSERT INTO users(name, username, password) VALUES(?, ?, ?)`, [name, username, password], userId => {
      Group.createPersonalGroup(`${name}'s personal tasks`, groupId => {
        UserGroup.create(userId, groupId, callback);
      });
    });
  }

  getUserByUsername(username, callback) {
    this.db.get(`SELECT * FROM users WHERE username = ?`, [username], callback);
  }

  getUserById(userId, callback) {
    this.db.get(`SELECT * FROM users WHERE id = ?`, [userId], callback);
  }

  getUsersByIds(userIds, callback) {
    let sql = `SELECT * FROM users WHERE id IN (?#)`.replace('?#', userIds.map(() => '?').join(','));
    this.db.all(sql, userIds, callback);
  }

  editBiography(userId, biography, callback) {
    this.db.run(`UPDATE users SET biography = ? WHERE id = ?`, [biography, userId], callback);
  }

  deleteUser(userId) {
    this.db.run(`DELETE FROM users WHERE id = ?`, [userId]);
  }
}

module.exports = new UserSchema();