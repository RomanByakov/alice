var express = require('express');
var router = express.Router();

var Department = require('../models/department');

router.route('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    Department.find({}, function(err, departments) {
      if (err) {
        throw err;
      }

      res.send(departments);
    });
  })
  .post(function(req, res, next) {
    Department.createDepartment(req.body.name, req.body.teams, function(err, department) {
      if (err) {
        throw err;
      } else {
        res.json(department);
      }
    });
  });

router.route('/:id', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    Department.findOne({
      '_id': req.params.id
    }, function(err, department) {
      if (err) {
        throw err;
      }
      res.json(department);
    });
  })
  .put(function(req, res, next) {
    Department.findOne({
      '_id': req.body._id
    }, function(err, department) {
      if (err) {
        throw err;
      }

      department.updateDepartment(req.body.name, req.body.teams, function(err) {
        if (err) {
          throw err;
        } else {
          res.json(department);
        }
      });
    });
  }).delete(function(req, res, next) {
    Department.remove({
      '_id': req.params.id
    }, function(err, removed/*what is?*/) {
      if (err) {
        throw err;
      }

      res.json({success: true});
    });
  });

module.exports = router;
