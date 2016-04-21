// dependencies
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// models
var User = require('../models/user');

router.route('/')
  .post(function(req, res, next) { // find the user
    User.findOne({
      username: req.body.username
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {

        // check if password matches
        if (user.password != User.hashPassword(req.body.password)) {
          res.status(400).json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, req.app.get('apliceSecret'), {
            expiresIn: 86400 // expires in 24 hours
          });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            user: user
          });
        }

      }

    });
  });

// return module
module.exports = router;
