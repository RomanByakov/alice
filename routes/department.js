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
var User = require('../models/user');
var Team = require('../models/team');

var getDepartments = function(req, res, next) {
  try {
    Department.find()
    .then(function(departments) {
      res.send(departments);
    })
    .catch((err) => { helper.handleError(res, err); })
  } catch(err) {
    helper.handleError(res, err);
  }
};

var addLead = function(department) {
  if (department.lead == null) {
    return Q.fcall(() => { return department; });
  }

  return User.findOne({_id: department.lead._id})
  .then((user) => { return department; });
};

var addTeams = function(department) {
  var methods = [];

  var teams = department.teams;
  department.teams = [];

  teams.forEach(function(item) {
    var team = new Team(item);

    methods.push(team.save().then((model) => { return model; }));
  });

  return Q.all(methods);
};

/**
 * All with Q
 * @todo: Create simple department model
 * @todo: add teams
 * @todo: add lead
 */
var postDepartment = function(req, res, next) {
  try {
    var params = helper.getParams(Department.postRequired(), req);

    var department = new Department(params);

    addLead(department)
    .then(() => {
      return addTeams(department);
    })
    .then((results) => {
      results.forEach(function(team) {
        department.teams.push(team);
      });

      return true;
    })
    .then(() => {
      if (req.files) {
        var file = req.files.file;

        return upload.departmentLogo(file, department);
      }
    })
    .then(() => { return department.save(); })
    .then(() => { res.send(department); })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var getDepartment = function(req, res, next) {
  var required = [{
    name: 'id',
    status: true
  }];

  try {
    var params = helper.getParams(required, req);

    Department.findOne({'_id': params.id})
    .then((department) => { res.send(department); })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var updateDepartment = function(req, res, next) {
  try {
    var params = helper.getParams(Department.updateRequired(), req);

    Department.findOne({'_id': params.id})
    .then((department) => {
        return User.find({department: department})
        .then((users) => {

          return department.updateDepartment(params)
          .then((department) => {

            if (params.lead) {
              User.findOne({_id: params.lead._id})
              .then((user) => {
                if (user) {
                  department.lead = user;
                }
              })
              .catch((err) => { helper.handleError(res, err); });
            }

            var send = function(department) {
              var methods = [];
              users.forEach((user) => {
                user.department = department;
                methods.push(user.save());
              });

              return Q.all(methods)
              .then(() => { res.send(department); });
            };

            if (req.files) {
              var file = req.files.file;

              upload.departmentLogo(file, department)
              .then(function(result) {
                if (result !== false) {
                  send(result);
                } else {
                  send(result);
                }
              });
            } else {
              send(department);
            }
          });
        })
        .catch((err) => { helper.handleError(res, err); });
     })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var deleteDepartment = function(req, res, next) {
  var required = [{
    name: 'id',
    status: true
  }];

  try {
    var params = helper.getParams(required, req);

    Department.findOne({'_id': params.id})
    .then((department) => {
      User.findOne({'department': department})
      .then((user) => {
        if (user) throw new Error('Department used by users');
      })
      .catch((err) => { helper.handleError(res, err); })

      return department.deleteDepartment()
      .then((department) => { res.send(department); });
     })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

router.route('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(getDepartments)
  .post(multipartyMiddleware, postDepartment);

router.route('/:id', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(getDepartment)
  .put(multipartyMiddleware, updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
