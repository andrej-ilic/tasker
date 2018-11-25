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
        title TEXT,
        content TEXT,
        groupId INTEGER,
        color TEXT,
        isPersonal INTEGER
      )
    `, []);
  }

  create(title, content, color, groupId, isPersonal, callback) {
    this.db.run(`INSERT INTO tasks (title, content, color, groupId, isPersonal) VALUES (?, ?, ?, ?, ?)`, [title, content, color, groupId, isPersonal],
      function(err) {
        if (err) throw err;
        if (callback) callback(this.lastID);
      }
    );
  }

  getTasksByGroupId(groupId, callback) {
    this.db.all(`SELECT * FROM tasks WHERE groupId = ?`, [groupId],
      (err, rows) => {
        if (err) throw err;
        if (callback) callback(rows);
      }
    );
  }

  finishTask(taskId, callback) {
    this.db.run(`UPDATE tasks SET isFinished = 1 WHERE id = ?`, [taskId],
      function(err) {
        if (err) throw err;
        if (callback) callback(this.lastID);
      }
    );
  }

  undoTask(taskId, callback) {
    this.db.run(`UPDATE tasks SET isFinished = 0 WHERE id = ?`, [taskId],
      function(err) {
        if (err) throw err;
        if (callback) callback(this.lastID);
      }
    );
  }

  updateTask(taskId, title, content, color, callback) {
    this.db.run(`UPDATE tasks SET title = ?, content = ?, color = ? WHERE id = ?`, [title, content, color, taskId],
      function(err) {
        if (err) throw err;
        if (callback) callback(this.lastID); 
      }
    );
  }

  deleteTask(taskId) {
    this.db.run(`DELETE FROM tasks WHERE id = ?`, [taskId]);
  }
}

module.exports = new TaskSchema();