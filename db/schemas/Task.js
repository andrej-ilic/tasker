const db = require('../db');

class TaskSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isFinished INTEGER DEFAULT 0,
        content TEXT,
        groupId INTEGER,
        isPersonal INTEGER,
        CONSTRAINT tasks_fk_groupId FOREIGN KEY (groupId) REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE
      )
    `, []);
  }

  create(content, groupId, isPersonal, isFinished) {
    this.db.run(`INSERT INTO tasks (content, groupId, isPersonal, isFinished) VALUES (?, ?, ?, ?)`, [content, groupId, isPersonal, isFinished],
      function(err) {
        if (err) throw err;
        callback(this.lastID);
      }
    );
  }
}

module.exports = new TaskSchema();