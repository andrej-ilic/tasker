const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../helpers/auth');

const User = require('../db/schemas/User');
const Task = require('../db/schemas/Task');
const Group = require('../db/schemas/Group');
const UserGroup = require('../db/schemas/UserGroup');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

// User registration
router.post('/register', (req, res) => {
  let username = req.body.username;
  let name = req.body.name;
  let password = req.body.password;
  let password2 = req.body.password2;

  User.getUserByUsername(username, user => {
    let errors = [];

    if (password != password2) {
      errors.push({
        text: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      errors.push({
        text: 'Password must be at least 6 characters long'
      });
    }

    if (user) {
      errors.push({
        text: 'A user with that username already exists'
      });
    }

    if (errors.length > 0) {
      res.render('users/register', {
        errors: errors,
        name: name,
        username: username
      });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          User.create(name, username, hash, userId => {
            req.flash('success_msg', 'Successfully registered');
            res.redirect('/users/login');
          });
        });
      });
    }
  });
});

// User login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/me',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// User logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Logged out');
  res.redirect('/');
});

// Logged in user's profile
router.get('/me', ensureAuthenticated, (req, res) => {
  res.redirect(`/users/${req.user.id}`);
});

// User profile
router.get('/:id', ensureAuthenticated, (req, res) => {
  let userId = req.params.id;
  let isPersonalPage = req.user.id == userId;

  User.getUserById(userId, user => {
    if (!user) {
      res.render('notFound', {
        error: 'User not found'
      });
      return;
    }
    Group.getPersonalGroup(userId, personalGroup => {
      Task.getTasksByGroupId(personalGroup.id, personalTasks => {
        UserGroup.getGroupIdsByUserId(userId, groupIds => {
          groupIds = groupIds.map(x => x.groupId);
          Group.getGroupsByIds(groupIds, usersGroups => {
            usersGroups = usersGroups.filter(group => group.isPersonal == false);
            Task.getTasksByGroupIds(groupIds, tasks => {
              usersGroups.forEach(group => {
                group.tasks = tasks.filter(task => task.groupId == group.id);
                group.primaryCount = group.tasks.filter(task => task.color == 'primary' && !task.isFinished).length;
                group.successCount = group.tasks.filter(task => task.color == 'success' && !task.isFinished).length;
                group.dangerCount = group.tasks.filter(task => task.color == 'danger' && !task.isFinished).length;
                group.warningCount = group.tasks.filter(task => task.color == 'warning' && !task.isFinished).length;
                group.infoCount = group.tasks.filter(task => task.color == 'info' && !task.isFinished).length;
                group.colorlessCount = group.tasks.filter(task => !task.color && !task.isFinished).length;
              });
              personalTasks.todo = personalTasks.filter(task => task.isFinished == false).reverse().slice(0, 6).map(task => {
                if (task.content.length > 70) {
                  task.content = task.content.slice(0, 70);
                  task.content += '...';
                }
                return task;
              });
              personalTasks.finished = personalTasks.filter(task => task.isFinished == true).reverse().slice(0, 6).map(task => {
                if (task.content.length > 70) {
                  task.content = task.content.slice(0, 70);
                  task.content += '...';
                }
                return task;
              });
              res.render('users/profile', {
                userProfile: user,
                personalTasks: personalTasks,
                isPersonalPage: isPersonalPage,
                usersGroups: usersGroups
              });
            });
          });
        });
      });
    });
  });
});

// Update bio
router.put('/bio', ensureAuthenticated, (req, res) => {
  User.editBiography(req.user.id, req.body.biography);
});

module.exports = router;