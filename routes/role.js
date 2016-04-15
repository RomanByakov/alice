var express = require('express');
var router = express.Router();

var Role = require('../models/role');

router.route('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    User.checkAccess(req.currentUser.role.name, 'User', function (err) {
        if (err) {
          throw err;
        }
    });

    Role.find({}, function(err, roles) {
      if (err) {
         throw err;
       }

      res.json(roles);
    });
  })
  .post(function(req, res, next) {
    User.checkAccess(req.currentUser.role.name, 'Admin', function (err) {
        if (err) {
          throw err;
        }
    });
    //todo: implement
  });

router.route('/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    User.checkAccess(req.currentUser.role.name, 'User', function (err) {
        if (err) {
          throw err;
        }
    });

    Role.findOne({
      '_id': req.params.id
    }, function(err, role) {
      if (err) {
        throw err;
      }

      res.json(role);
    });
  })
  .put(function(req, res, next) {
    User.checkAccess(req.currentUser.role.name, 'Admin', function (err) {
        if (err) {
          throw err;
        }
    });
    //todo: implement
  }).delete(function(req, res, next) {
    User.checkAccess(req.currentUser.role.name, 'Admin', function (err) {
        if (err) {
          throw err;
        }
    });
    //todo: implement
  });

module.exports = router;
