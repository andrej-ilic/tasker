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
        groupId INTEGER,
        CONSTRAINT user_group_pk PRIMARY KEY (userId, groupId)
        CONSTRAINT users_groups_fk_userId FOREIGN KEY (userId) REFERENCES users(id)
        CONSTRAINT users_groups_fk_groupId FOREIGN KEY (groupId) REFERENCES groups(id)
      )
    `, []);
  }

  create(userId, groupId) {
    this.db.run(`INSERT INTO users_groups (userId, groupId) VALUES (?, ?)`, [userId, groupId],
      function(err) {
        if (err) throw err;
        if (callback) callback(this.lastID);
      }
    );
  }
}

module.exports = new UserGroupSchema();