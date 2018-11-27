module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Not authorized');
    res.redirect('/users/login');
  },
  
  ensureGuest: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/users/me');
  }
}