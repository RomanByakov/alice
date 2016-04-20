// dependencies
var express = require('express');
var router = express.Router();

// models
var User = require('../models/user');
var Department = require('../models/department');
var fs = require('fs');

var upload = require('../modules/upload');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({
  uploadDir: __dirname + "/../public/img/tmp/"
});

var logger = require('../modules/alice-logger');
var Q = require('q');

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
    User.createUser(
      req.body.name,
      req.body.lastname,
      req.body.login,
      req.body.password,
      req.body.team,
      req.body.department,
      req.body.role
    )
    .then(function(user) {
      if (req.files) {
        var file = req.files.file;

        upload.avatar(file, user)
        .then(function(result) {
          if (result !== false) {
            result.populate();
            res.send(result);
          } else {
            user.populate();
            res.send(user);
          }
        });
      } else {
        user.populate();
        res.send(user);
      }
    })
    .catch((err) => { throw err ;});
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
    logger.debug('[User::PUT] Department is ' + req.body.department);
    logger.debug(req.body);

    User.findOne({'_id': req.body._id})
    .then(function(user) {
      user.updateUser(
          req.body.name,
          req.body.lastname,
          req.body.username,
          req.body.password,
          req.body.team,
          req.body.department,
          req.body.role
        )
        .then(function(user) {
          //todo: not saving user, without causes
          if (req.files) {
            var file = req.files.file;

            upload.avatar(file, user)
            .then(function(result) {
              if (result instanceof User) {
                result.populate();
                res.send(result);
              } else {
                user.populate();
                res.send(user);
              }
            });
          } else {
            user.populate();
            res.send(user);
          }
        })
        .catch((err) => { throw err;});
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
