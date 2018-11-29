const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

const Group = require('../db/schemas/Group');
const User = require('../db/schemas/User');
const UserGroup = require('../db/schemas/UserGroup');
const Task = require('../db/schemas/Task');

// Groups page
router.get('/', ensureAuthenticated, (req, res) => {
  let userId = req.user.id;

  UserGroup.getGroupIdsByUserId(userId, groupIds => {
    groupIds = groupIds.map(x => x.groupId);
    Group.getGroupsByIds(groupIds, usersGroups => {
      Task.getTasksByGroupIds(groupIds, tasks => {
        usersGroups = usersGroups.filter(group => group.isPersonal == false);
        usersGroups.forEach(group => {
          group.tasks = tasks.filter(task => task.groupId == group.id);
          group.primaryCount = group.tasks.filter(task => task.color == 'primary' && !task.isFinished).length;
          group.successCount = group.tasks.filter(task => task.color == 'success' && !task.isFinished).length;
          group.dangerCount = group.tasks.filter(task => task.color == 'danger' && !task.isFinished).length;
          group.warningCount = group.tasks.filter(task => task.color == 'warning' && !task.isFinished).length;
          group.infoCount = group.tasks.filter(task => task.color == 'info' && !task.isFinished).length;
          group.colorlessCount = group.tasks.filter(task => !task.color && !task.isFinished).length;
        });
        res.render('groups/index', {
          usersGroups: usersGroups
        });
      });
    });
  });
});

// Group page
router.get('/:id', ensureAuthenticated, (req, res) => {
  let groupId = req.params.id;

  Group.getGroupById(groupId, group => {
    if (!group) {
      res.render('notFound', {
        error: 'Group not found'
      });
      return;
    } else if (group.isPersonal) {
      UserGroup.getRow(req.user.id, groupId, row => {
        if (row) {
          res.redirect('/tasks');
        } else {
          req.flash('error_msg', 'Not authorized');
          res.redirect('/groups');
        }
      });
      return;
    }
    Task.getTasksByGroupId(groupId, tasks => {
      UserGroup.getUserIdsByGroupId(groupId, userIds => {
        userIds = userIds.map(userId => userId.userId);
        User.getUsersByIds(userIds, users => {
          tasks.forEach(task => {
            task.isPrimary = task.color == 'primary';
            task.isSuccess = task.color == 'success';
            task.isDanger = task.color == 'danger';
            task.isWarning = task.color == 'warning';
            task.isInfo = task.color == 'info';
            task.hasColor = task.isPrimary || task.isSuccess || task.isDanger || task.isWarning || task.isInfo;
          });
          res.render('groups/groupPage', {
            tasks: tasks,
            group: group,
            users: users
          });
        });
      });
    });
  });
});

// Add group
router.post('/add', ensureAuthenticated, (req, res) => {
  let userId = req.user.id;
  let groupName = req.body.groupName;

  Group.create(groupName, groupId => {
    UserGroup.create(userId, groupId, rowId => {
      res.redirect('/groups');
    });
  });
});

// Delete group
router.delete('/:id/delete', ensureAuthenticated, (req, res) => {
  let groupId = req.params.id;

  Group.deleteGroup(groupId, () => {
    res.send('done');
  });
});

// Add user to group
router.post('/:id/users/add', ensureAuthenticated, (req, res) => {
  let groupId = req.params.id;
  let username = req.body.username;

  User.getUserByUsername(username, user => {
    if (!user) {
      req.flash('error_msg', `User ${username} not found`);
      res.redirect(`/groups/${groupId}`);
      return;
    }
    UserGroup.getRow(user.id, groupId, row => {
      if (row) {
        req.flash('error_msg', `User ${username} is already in this group`);
        res.redirect(`/groups/${groupId}`);
        return;
      }
      UserGroup.create(user.id, groupId);
      req.flash('success_msg', `User ${username} added to the group`);
      res.redirect(`/groups/${groupId}`);
    });
  });
});

// Add task to group
router.post('/:id/add', ensureAuthenticated, (req, res) => {
  let groupId = req.params.id;
  let title = req.body.title;
  let content = req.body.content;
  let color = req.body.color

  Task.create(title, content, color, groupId, taskId => {
    res.redirect(`/groups/${groupId}`);
  });
});

module.exports = router;