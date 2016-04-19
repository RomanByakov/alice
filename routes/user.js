// dependencies
var express = require('express');
var router = express.Router();

// models
var User = require('../models/user');
var fs = require('fs');

var upload = require('../modules/upload');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({
  uploadDir: __dirname + "/../public/img/tmp/"
});

router.route('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    User.find({}, function(err, users) {
      // error
      if (err) {
         throw err;
       }

       User.populateRecords(users);
      res.json(users);
    });
  })
  .post(multipartyMiddleware, function(req, res, next) {
    User.checkAccess(req.currentUser.role.name, 'Admin', function (err) {
        if (err) {
          throw err;
        }
    });

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
          if (req.files) {
            var file = req.files.file;

            upload.avatar(file, user, function(user) {
              if (user) {
                user.populate();
              }
            });
          }

          res.json(user);
        }
      });
  });

router.route('/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    User.findOne({
      '_id': req.params.id
    }, function(err, user) {
      if (err) {
        throw err;
      }

      user.populate();
      res.json(user);
    });
  })
  .put(multipartyMiddleware, function(req, res, next) {
    if (req.currentUser._id != req.body._id) {
      User.checkAccess(req.currentUser.role.name, 'Admin', function (err) {
          if (err) {
            throw err;
          }
      });
    }

    User.findOne({
      '_id': req.body._id
    }, function(err, user) {
      if (err) {
        throw err;
      }

      console.log(req.body.team);
      user.updateUser(
          req.body.name,
          req.body.lastname,
          req.body.username,
          req.body.password,
          req.body.team,
          req.body.department,
          req.body.role,
          function (err, user) {
            if (err) {
              throw err;
            } else {
              if (req.files) {
                var file = req.files.file;

                upload.avatar(file, user, function(user) {
                  if (user) {
                    user.populate();
                    res.json(user);
                  }
                });
              }

              res.json(user);
            }
          }
        );
    });
  }).delete(function(req, res, next) {

    User.remove({
      '_id': req.params.id
    }, function(err, removed) {
      if (err) throw err;

      res.json({
        success: true
      });
    });
  });

module.exports = router;
