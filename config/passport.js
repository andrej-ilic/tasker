const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../db/schemas/User');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'username' }, 
    (username, password, done) => {
      User.getUserByUsername(username, user => {
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        bcrypt.compare(password, user.hash, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.getUserById(id, user => {
      done(null, user);
    });
  });
}