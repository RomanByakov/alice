// dependencies
var express = require('express');
var router = express.Router();

// models
var User = require('../models/user');
var fs = require('fs');

router.route('/')
  .get(function(req, res, next) {
    User.find({}, function(err, users) {
      // error
      if (err) throw err;

      res.header("Access-Control-Allow-Origin", "*");
      res.send(users);
    });
  })
  .post(function(req, res, next) {
    // var user = new User(req.body);
    // user.password = 123456;
    // user.username = (req.body.name[0] + req.body.lastname).toLowerCase();
    // user.save(function(err, user) {
    //   if (err) throw err;
    //   res.send(user);
    // });

    console.log(req);

    console.log(req.body);

    User.createUser(
      req.body.name,
      req.body.lastname,
      req.body.login,
      req.body.password,
      req.body.team,
      req.body.department,
      req.body.role,
      function (err) {
        if (err) {
          throw err;
        } else {
          if (!req.files) {
            res.json({success: true});
            return;
          }

          console.log(req.files);

          fs.readFile(req.files.avatar.path, function (err, data) {
            if (err) {
              //avatar is not required, so if it's empty then send success response
              res.json({success: true});
            } else {
              var path = __dirname + "../public/img/avatars/" + this._id;
              fs.writeFile(path, data, function (err) {
                if (err) {
                  throw err;
                }
              });

              this.save(function(err) {
                if (err) {
                  throw err;
                } else {
                  res.json({success: true});
                }
              })
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
