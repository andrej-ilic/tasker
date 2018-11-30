const db = require('../db');

class GroupSchema {
  constructor() {
    this.db = db;
    this.createTable();
  }

  createTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id           INTEGER   PRIMARY KEY   AUTOINCREMENT,
        name         TEXT      NOT NULL      DEFAULT '',
        isPersonal   INTEGER   NOT NULL      DEFAULT 0,
        ownerId      INTEGER
      )
    `, []);
  }

  create(name, ownerId, callback) {
    this.db.run(`INSERT INTO groups(name, ownerId) VALUES(?, ?)`, [name, ownerId], callback);
  }

  createPersonalGroup(name, callback) {
    this.db.run(`INSERT INTO groups(name, isPersonal) VALUES (?, 1)`, [name], callback);
  }

  getPersonalGroup(userId, callback) {
    this.db.get(`SELECT groups.id, groups.name, groups.isPersonal
                 FROM (SELECT groupId FROM users_groups WHERE userId = ?) usersGroups INNER JOIN groups ON groups.id = usersGroups.groupId 
                 WHERE groups.isPersonal = 1`, [userId], callback);
  }

  getGroupById(groupId, callback) {
    this.db.get(`SELECT * FROM groups WHERE id = ?`, [groupId], callback);
  }

  getGroupsByIds(groupIds, callback) {
    let sql = `SELECT * FROM groups WHERE id IN (?#) AND isPersonal = 0`.replace('?#', groupIds.map(() => '?').join(','));
    this.db.all(sql, groupIds, callback);
  }

  deleteGroup(groupId, callback) {
    this.db.run(`DELETE FROM groups WHERE id = ?`, [groupId], callback);
  }
}

module.exports = new GroupSchema();