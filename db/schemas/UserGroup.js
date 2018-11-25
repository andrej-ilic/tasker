const db = require('../db');

class UserGroupSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users_groups (
        userId INTEGER,
        groupId INTEGER
      )
    `, []);
  }

  create(userId, groupId, callback) {
    this.db.run(`INSERT INTO users_groups (userId, groupId) VALUES (?, ?)`, [userId, groupId],
      function (err) {
        if (err) throw err;
        if (callback) callback(this.lastID);
      }
    );
  }

  getGroupIdsByUserId(userId, callback) {
    this.db.all(`SELECT groupId FROM users_groups WHERE userId = ?`, [userId],
      function (err, rows) {
        if (err) throw err;
        if (callback) callback(rows);
      }
    );
  }

  getUserIdsByGroupId(groupId, callback) {
    this.db.all(`SELECT userId FROM users_groups WHERE groupId = ?`, [groupId],
      function (err, rows) {
        if (err) throw err;
        if (callback) callback(rows);
      }
    );
  }

  getRow(userId, groupId, callback) {
    this.db.get(`SELECT * FROM users_groups WHERE userId = ? AND groupId = ?`, [userId, groupId],
      function(err, row) {
        if (err) throw err;
        if (callback) callback(row);
      }
    );
  }
}

module.exports = new UserGroupSchema();