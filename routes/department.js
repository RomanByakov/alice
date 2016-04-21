// dependencies
var express = require('express');
var router = express.Router();

var fs = require('fs');

var upload = require('../modules/upload');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({
  uploadDir: __dirname + "/../public/img/tmp/"
});

var Q = require('q');

//Helpers
var logger = require('../modules/alice-logger');
var helper = require('../modules/api-helper');

// models
var Department = require('../models/department');

var getDepartments = function(req, res, next) {
  try {
    Department.find()
    .then(function(departments) {
      res.send(departments);
    })
    .catch((err) => { res.json({error: err.message}); })
  } catch(err) {
    res.json({error: err.message});
  }
};

var postDepartment = function(req, res, next) {
  var required = [{
    name: 'name',
    status: true
  }, {
    name: 'teams',
    status: true
  }];

  try {
    var params = helper.getParams(required, req);

    Department.createDepartment(params.name, params.teams)
    .then((department) => { res.send(department); })
    .catch((err) => { res.json({error: err.message}); });
  } catch (err) {
    res.json({error: err.message});
  }
};

var getDepartment = function(req, res, next) {

};

var updateDepartment = function(req, res, next) {

};

var deleteDepartment = function(req, res, next) {

};

router.route('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(getDepartments)
  .post(postDepartment);

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
