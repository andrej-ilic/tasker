const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

const PersonalGroup = require('../db/schemas/PersonalGroup');
const Task = require('../db/schemas/Task');

router.get('/', ensureAuthenticated, (req, res) => {
  PersonalGroup.getPersonalGroupByUserId(req.user.id, personalGroup => {
    Task.getTasksByGroupId(personalGroup.id, tasks => {
      tasks = Array.from(tasks);
      tasks.forEach(task => {
        task.isPrimary = task.color == 'primary';
        task.isSuccess = task.color == 'success';
        task.isDanger = task.color == 'danger';
        task.isWarning = task.color == 'warning';
        task.isInfo = task.color == 'info';
        task.hasColor = task.isPrimary || task.isSuccess || task.isDanger || task.isWarning || task.isInfo;
      });
      res.render('tasks', {
        group: personalGroup,
        tasks: tasks
      });
    });
  });
});

router.post('/add', ensureAuthenticated, (req, res) => {
  let title = req.body.title;
  let content = req.body.content;
  let groupId = req.body.groupId;
  let color = req.body.color ? req.body.color : '';
  Task.create(title, content, color, groupId, 1, taskId => {
    res.redirect('/tasks');
  });
});

// Finish task
router.put('/:id/finish', ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  Task.finishTask(id);
});

router.put('/:id/undo', ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  Task.undoTask(id);
});

// Delete task
router.delete('/:id', ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  Task.deleteTask(id);
});

// Edit task
router.put('/:id', ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  let title = req.body.title;
  let content = req.body.content;
  let color = req.body.color ? req.body.color : '';
  Task.updateTask(id, title, content, color);
});

module.exports = router;