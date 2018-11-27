const db = require('../db');

class UserGroupSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users_groups (
        userId    INTEGER,
        groupId   INTEGER,
        PRIMARY KEY(userId, groupId),
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(groupId) REFERENCES groups(id) ON DELETE CASCADE
      )
    `, []);
  }

  create(userId, groupId, callback) {
    this.db.run(`INSERT INTO users_groups (userId, groupId) VALUES (?, ?)`, [userId, groupId], callback);
  }

  getGroupIdsByUserId(userId, callback) {
    this.db.all(`SELECT groupId FROM users_groups WHERE userId = ?`, [userId], callback);
  }

  getUserIdsByGroupId(groupId, callback) {
    this.db.all(`SELECT userId FROM users_groups WHERE groupId = ?`, [groupId], callback);
  }

  getRow(userId, groupId, callback) {
    this.db.get(`SELECT * FROM users_groups WHERE userId = ? AND groupId = ?`, [userId, groupId], callback);
  }
}

module.exports = new UserGroupSchema();