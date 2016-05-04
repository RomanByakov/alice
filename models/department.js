// dependencies
var mongoose = require('mongoose');
var Team = require('./team');
var User = require('./user');

var Q = require('q');
var logger = require('../modules/alice-logger');
var validators = require('../modules/validators');

var departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  logo: {
    type: String,
    default: '../img/empty-img.png'
  },
  teams:[mongoose.Schema.Types.Mixed],
  color: {
    type: String,
    default: null,
    validate: validators.colorValidator
  },
  phone: {
    type: String,
    default: null,
    validate: validators.phoneValidator
  },
  lead: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  description: {
    type: String,
    default: null
  }
});

var setTeams = function(teams, dep) {
  for (var i = 0; i < teams.length; i++) {
    var team = new Team(teams[i]);

    team.save();
    dep.teams.push(team);
  }

  return Q.fcall(() => { return true; });
};

departmentSchema.methods.updateDepartment = function(params) {
    this.name = params.name;
    this.color = params.color;
    this.phone = params.phone;
    this.description = params.description;

    this.teams = [];

    return setTeams(params.teams, this)
    .then(() => { return this.save(); });
};

departmentSchema.methods.deleteDepartment = function() {
  var methods = [];

  this.teams.forEach(function(team) {
    if (team != null) {
      methods.push(Team.findOneAndRemove({_id: team._id}));
    }
  });

  return Q.all(methods)
    .then(() => {
      return this.remove();
    });
};

departmentSchema.statics.createDepartment = function(params) {
  "use strict";
  var department = new Department({
    name: params.name,
    color: params.color,
    phone: params.phone,
    description: params.description
  });

  return setTeams(params.teams, department)
  .then(() => { return department.save(); });
};

/**
 * API routes required fields configs
 */
departmentSchema.statics.postRequired = function() {
  return [{
    name: 'name',
    status: true
  }, {
    name: 'teams',
    status: true
  }, {
    name: 'color',
    status: false
  }, {
    name: 'description',
    status: false
  }, {
    name: 'phone',
    status: false
  }, {
    name: 'lead',
    status: false
  }];
};

departmentSchema.statics.updateRequired = function() {
  return [{
    name: 'name',
    status: true
  }, {
    name: 'teams',
    status: true
  }, {
    name: 'color',
    status: false
  }, {
    name: 'description',
    status: false
  }, {
    name: 'phone',
    status: false
  }, {
    name: 'lead',
    status: false
  }, {
    name: 'id',
    status: true
  }];
};

var Department = mongoose.model('Departments', departmentSchema);
//Department.findOne = Q.nbind(Department.findOne.bind(Department));

module.exports = Department;
