var express = require('express');
var router = express.Router();

var Role = require('../models/role');

router.route('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    Role.find({}, function(err, roles) {
      if (err) {
         throw err;
       }

      res.json(roles);
    });
  })
  .post(function(req, res, next) {
    Role.createRole(req.body.name, req.body.child, function(err, role) {
      if (err) {
        throw err;
      } else {
        res.json(role);
      }
    });
  });

router.route('/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
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
    Role.findOne({_id: req.body.id}, function(err, role) {
      if (err) {
        throw err;
      } else {
        role.updateRole(req.body.name, req.body.child, function(err, role) {
          if (err) {
            throw err;
          } else {
            res.json(role);
          }
        });
      }
    });
  }).delete(function(req, res, next) {
    Role.findOne({_id: req.body.id}, function(err, role) {
      if (err) {
        throw err;
      } else {
        role.remove(function(err) {
          if (err) {
            throw err;
          } else {
            res.json({success: true});
          }
        })
      }
    });
  });

module.exports = router;
