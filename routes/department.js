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

/**
 * Adding lead to mongoose model (team or department) with same field.
 * @param model
 * @return Q.Promise
 */
var addLead = function(model) {
  if (model.lead == null || model.lead == undefined) {
    return Q.fcall(() => { return model; });
  }

  return User.findOne({_id: model.lead._id})
  .then((user) => { return model; });
};

/**
 * Update fields of team or department using another instance.
 * @param from
 * @param to
 * @return to
 */
var updateModel = function(from, to) {
  to.color = from.color;
  to.phone = from.phone;
  to.description = from.description;
  to.lead = from.lead;

  if (to instanceof Department && from instanceof Department) {
    to.teams = from.teams;
  }

  return to;
};

/**
 * Handle only one team.
 * Team must be unique in Teams model.
 * And team can't be more then one department.
 * @param team
 * @return Q.Promise
 */
var addTeam = function(team, departmentId) {
  return addLead(team)
  .then(() => {
    return Team.findOne({name: team.name})
  })
  .then ((model) => {
    if (model) {
      return Department.findOne({teams: {$elemMatch: {name: team.name}}})
    } else {
      return team.save();
    }
  })
  .then((model) => {
    if (model instanceof Team) {
      return updateModel(team, model).save();
    } else if (model == null) {
      return team;
    } else {
      logger.debug('[APIDepartments::addTeam] model is Department = ' + (model instanceof Department)
          + " and departmentId = " + departmentId + " and model._id = " + model._id
          + " and deprtmentId == model._id = " + (model._id == departmentId)
          + " and type of model._id = " + typeof model._id + " and type of departmentId = " + typeof departmentId
          + " and equals = " + model._id.equals(departmentId));
      if (model instanceof Department && model._id.equals(departmentId)) {
        logger.debug('[APIDepartments::addTeam] Condition success, start updating team');
        return updateTeamInCurrentDepartment(team);
      } else {
        logger.error('[APIDepartments::addTeam] Condition fails, throwing error');
        throw new Error();
      }
    }
  })
  .catch((err) => {
    logger.error('[APIDepartments::addTeam] Exception message = ' + err.message);
    throw new Error("Team '" + team.name + "' already exists");
  });
};

/**
 * @param team
 */
var updateTeamInCurrentDepartment = function(team) {
  return Team.findOne({name: team.name})
    .then((model) => { return updateModel(team, model).save(); });
};

/**
 * Adding teams to department.
 * @param department
 * @param departmentId
 * @return Q.Promise
 */
var addTeams = function(department, departmentId) {
  var methods = [];

  var teams = department.teams;
  department.teams = [];

  teams.forEach(function(item) {
    var team = new Team(item);

    methods.push(addTeam(team, departmentId));
  });

  return Q.all(methods);
};

/**
 * Create department and teams in it. All with Q.
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

/**
 * Get department by id.
 */
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

/**
 * Updating of department.
 * Same logic like in post department, but on existing instance.
 */
var updateDepartment = function(req, res, next) {
  try {
    var params = helper.getParams(Department.updateRequired(), req);

    var department = new Department(params);

    Department.findOne({_id: params.id})
    .then((model) => { return addLead(updateModel(department, model)); })
    .then((model) => {
      department = model;
      return addTeams(model, department._id);
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
