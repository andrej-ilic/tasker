const db = require('../db');

class TaskSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id            INTEGER   PRIMARY KEY   AUTOINCREMENT,
        isFinished    INTEGER   NOT NULL      DEFAULT 0,
        title         TEXT      NOT NULL      DEFAULT '',
        content       TEXT,
        color         TEXT,
        groupId       INTEGER,
        FOREIGN KEY(groupId) REFERENCES groups(id) ON DELETE CASCADE
      )
    `, []);
  }

  create(title, content, color, groupId, callback) {
    this.db.run(`INSERT INTO tasks (title, content, color, groupId) VALUES (?, ?, ?, ?)`, [title, content, color, groupId], callback);
  }

  getTasksByGroupId(groupId, callback) {
    this.db.all(`SELECT * FROM tasks WHERE groupId = ?`, [groupId], callback);
  }

  getTasksByGroupIds(groupIds, callback) {
    let sql = `SELECT * FROM tasks WHERE groupId IN (?#)`.replace('?#', groupIds.map(() => '?').join(','));
    this.db.all(sql, groupIds, callback);
  }

  finishTask(taskId, callback) {
    this.db.run(`UPDATE tasks SET isFinished = 1 WHERE id = ?`, [taskId], callback);
  }

  undoTask(taskId, callback) {
    this.db.run(`UPDATE tasks SET isFinished = 0 WHERE id = ?`, [taskId], callback);
  }

  editTask(taskId, title, content, color, callback) {
    this.db.run(`UPDATE tasks SET title = ?, content = ?, color = ? WHERE id = ?`, [title, content, color, taskId], callback);
  }

  deleteTask(taskId, callback) {
    this.db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], callback);
  }
}

module.exports = new TaskSchema();