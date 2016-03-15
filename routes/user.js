// dependencies
var express = require('express');
var router = express.Router();

// models
var User = require('../models/user');

router.route('/')
  .get(function(req, res, next) {
    User.find({}, function(err, users) {
      // error
      if (err) throw err;
      // return users
      res.send(users);
      console.log(users);
    });
  })
  .post(function(req, res, next) {
    res.send("");
  });
  
// return module
module.exports = router;
