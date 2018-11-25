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

  create(name, callback) {
    this.db.run(`INSERT INTO groups(name) VALUES(?)`, [name],
      function (err) {
        if (err) throw err;
        if (callback) callback(this.lastID);
      }
    );
  }

  getGroupById(groupId, callback) {
    this.db.get(`SELECT * FROM groups WHERE id = ?`, [groupId],
      function (err, row) {
        if (err) throw err;
        if (callback) callback(row);
      }
    );
  }

  getGroupsByIds(groupIds, callback) {
    let sql = `SELECT * FROM groups WHERE id IN (?#)`.replace('?#', groupIds.map(() => '?').join(','));
    this.db.all(sql, groupIds,
      function(err, rows) {
        if (err) throw err;
        if (callback) callback(rows);
      }
    );
  }

  deleteGroup(groupId) {
    this.db.run(`DELETE FROM groups WHERE id = ?`, [groupId]);
  }
}

module.exports = new GroupSchema();