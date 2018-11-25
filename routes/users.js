const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {
  ensureAuthenticated
} = require('../helpers/auth');

const User = require('../db/schemas/User');
const Task = require('../db/schemas/Task');

router.get('/login', (req, res) => {
  res.render('users/login', {
    message: req.flash('error')
  });
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

// User registration
router.post('/register', (req, res) => {
  User.getUserByUsername(req.body.username, user => {
    let errors = [];

    if (req.body.password != req.body.password2) {
      errors.push({
        text: 'Passwords do not match'
      });
    }

    if (req.body.password.length < 6) {
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
        name: req.body.name,
        username: req.body.username
      });
    } else {
      let newUser = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.hash = hash;
          User.create(newUser, userId => {
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

router.get('/me', ensureAuthenticated, (req, res) => {
  res.redirect(`/users/${req.user.id}`);
});

// User profile
router.get('/:id', ensureAuthenticated, (req, res) => {
  let userId = req.params.id;
  let authenticatedUserId = req.user.id == userId;

  User.getUserById(userId, user => {
    Task.getTasksByGroupId(user.personalGroupId, tasks => {
      res.render('users/profile', {
        userProfile: user,
        authenticatedUserId: authenticatedUserId,
        todoTasks: tasks.filter(t => t.isFinished == false).reverse().slice(0, 6).map(x => {
          if (x.content.length > 70) {
            x.content = x.content.slice(0, 70);
            x.content += '...';
          }
          return x;
        }),
        finishedTasks: tasks.filter(t => t.isFinished == true).reverse().slice(0, 6).map(x => {
          if (x.content.length > 70) {
            x.content = x.content.slice(0, 70);
            x.content += '...';
          }
          return x;
        })
      });
    });
  });
});

// Update bio
router.put('/bio', ensureAuthenticated, (req, res) => {
  User.setBiography(req.user.id, req.body.biography);
});

module.exports = router;