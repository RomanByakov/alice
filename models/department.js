// dependencies
//var restful = require('node-restful');
//var mongoose = restful.mongoose;
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
    default: '../img/empty-img.jpg'
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
    type: [mongoose.Schema.Types.Mixed]
  },
  description: {
    type: String,
    default: null
  }
});

var setTeams = function(teams, dep) {
  for (var i = 0; i < teams.length; i++) {
    var team = new Team({
      name: teams[i].name,
      color: teams[i].color,
      phone: teams[i].phone,
      description: teams[i].description
    });

    team.save();
    dep.teams.push(team);
  }
};

departmentSchema.methods.updateDepartment = function(params) {
    this.name = params.name;
    this.color = params.color;
    this.phone = params.phone;
    this.description = params.description;

    this.teams = [];

    // for (var i = 0; i < params.teams.length; i++) {
    //   var team = new Team({
    //     name: params.teams[i].name,
    //     color: params.teams[i].color,
    //     phone: params.teams[i].phone,
    //     description: params.teams[i].description
    //   });
    //
    //   team.save();
    //   this.teams.push(team);
    // }

    setTeams(params.teams, this);

    return this.save();
};

departmentSchema.methods.deleteDepartment = function() {
  var methods = [];

  this.teams.forEach(function(team) {
      methods.push(Team.findOneAndRemove({_id: team._id}));
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

  logger.debug(teams);

  // for (var i = 0; i < params.teams.length; i++) {
  //   var team = new Team({
  //     name: params.teams[i].name
  //   });
  //
  //   //callback and then not working
  //   team.save();
  //
  //   department.teams.push(team);
  // }

  setTeams(params.teams, department);

  return department.save();
};

var Department = mongoose.model('Departments', departmentSchema);
//Department.findOne = Q.nbind(Department.findOne.bind(Department));

module.exports = Department;
