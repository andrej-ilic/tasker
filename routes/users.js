const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../db/schemas/User');

router.get('/login', (req, res) => {
  res.render('users/login');
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

module.exports = router;