const express = require('express');
const router = express.Router();
const { ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
  res.render('index');
});

module.exports = router;