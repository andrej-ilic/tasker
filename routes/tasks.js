const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

const PersonalGroup = require('../db/schemas/PersonalGroup');
const Task = require('../db/schemas/Task');

router.get('/', ensureAuthenticated, (req, res) => {
  PersonalGroup.getPersonalGroupByUserId(req.user.id, personalGroup => {
    Task.getTasksByGroupId(personalGroup.id, tasks => {
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
  Task.create(title, content, groupId, 1, taskId => {
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
  Task.updateTask(id, title, content);
});

module.exports = router;