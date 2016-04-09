var express = require('express');
var router = express.Router();

var Department = require('../models/department');

router.route('/')
  .get(function(req, res, next) {
    Department.find({}, function(err, departments) {
      if (err) throw err;

      res.header("Access-Control-Allow-Origin", "*");
      res.send(departments);
      //console.log(departments);
    });
  })
  .post(function(req, res, next) {
    Department.createDepartment(req.body.name, req.body.teams, function(err) {
      if (err) throw err;
      else {
        console.log('department saved');
        res.json({success: true});
      }
    });
  });

router.route('/:id')
  .get(function(req, res, next) {
    Department.findOne({
      '_id': req.params.id
    }, function(err, department) {
      if (err) throw err;
      res.header("Access-Control-Allow-Origin", "*");
      res.json(department);
      //console.log(department);
    });
  })
  .put(function(req, res, next) {
    Department.findOne({
      '_id': req.body._id
    }, function(err, department) {
      if (err) throw err;

      department.updateDepartment(req.body.name, req.body.teams, function(err) {
        if (err) throw err;
        else {
          res.header("Access-Control-Allow-Origin", "*");
          res.json(department);
          //console.log(department);
        }
      });
    });
  }).delete(function(req, res, next) {
    Department.remove({
      '_id': req.params.id
    }, function(err, removed/*what is?*/) {
      if (err) throw err;

      console.log('Department deleted successfully');
      res.json({success: true});
    });
  });

module.exports = router;
