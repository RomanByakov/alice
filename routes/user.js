// dependencies
var express = require('express');
var router = express.Router();

// models
var User = require('../models/user');
var fs = require('fs');
//
// var multer = require('multer');
// var upload = multer();

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({
  uploadDir: __dirname + "/../public/img/tmp/"
});

router.route('/')
  .get(function(req, res, next) {
    User.find({}, function(err, users) {
      // error
      if (err) throw err;

      res.header("Access-Control-Allow-Origin", "*");
      res.send(users);
    });
  })
  .post(multipartyMiddleware, function(req, res, next) {

    User.createUser(
      req.body.name,
      req.body.lastname,
      req.body.login,
      req.body.password,
      req.body.team,
      req.body.department,
      req.body.role,
      function (err, user) {
        if (err) {
          throw err;
        } else {
          var file = req.files.file;

          if (!file.avatar) {
            res.json({success: true});
            return;
          }

          //todo: extension
          var path = __dirname + "/../public/img/avatars/" + user._id + ".png";

          fs.rename(file.avatar.path, path, function(err) {
            if (err) {
              throw err;
            } else {
              user.avatar = path;

              user.save(function(err) {
                if (err) {
                  throw err;
                } else {
                  res.json(user);
                }
              });
            }
          });
        }
      });
  });

router.route('/:id')
  .get(function(req, res, next) {
    User.findOne({
      '_id': req.params.id
    }, function(err, user) {
      // error
      if (err) throw err;
      // return user
      res.header("Access-Control-Allow-Origin", "*");
      res.send(user);
      console.log(user);
    });
  })
  .put(function(req, res, next) {
    User.findOne({
      '_id': req.body._id
    }, function(err, user) {
      // error
      if (err) throw err;
      // return user
      //res.header("Access-Control-Allow-Origin", "*");
      user.username = req.body.username;
      user.name = req.body.name;
      user.lastname = req.body.lastname;
      user.department = req.body.department;
      user.team = req.body.team;

      user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({
          success: true
        });
      });
      //res.send(user);
      console.log(user);
    });
  }).delete(function(req, res, next) {
    User.remove({
      '_id': req.params.id
    }, function(err, removed) {
      if (err) throw err;

      console.log('User deleted successfully');
      res.json({
        success: true
      });
    });
  });

// return module
module.exports = router;
