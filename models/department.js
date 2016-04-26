// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Team = require('./team');
var User = require('./user');

var Q = require('q');
var logger = require('../modules/alice-logger');

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
  teams:[mongoose.Schema.Types.Mixed]
});

departmentSchema.methods.updateDepartment = function(name, teams) {
  this.name = name;

  this.teams = [];

  for (var i = 0; i < teams.length; i++) {
    var team = new Team({
      name: teams[i].name
    });

    team.save();
    this.teams.push(team);
  }

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

departmentSchema.statics.createDepartment = function(name, teams) {
  "use strict";
  var department = new Department({
    name: name
  });

  logger.debug(teams);

  for (var i = 0; i < teams.length; i++) {
    var team = new Team({
      name: teams[i].name
    });

    //callback and then not working
    team.save();

    department.teams.push(team);
  }

  return department.save();
};

var Department = mongoose.model('Departments', departmentSchema);
//Department.findOne = Q.nbind(Department.findOne.bind(Department));

module.exports = Department;
