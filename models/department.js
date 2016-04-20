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

departmentSchema.methods.updateDepartment = function(name, teams, callback) {
  this.name = name;

  this.teams = [];

  for (var i = 0; i < teams.length; i++) {
    var team = new Team({
      name: teams[i].name
    });

    team.save();
    this.teams.push(team);
  }

  this.save(callback);
};

departmentSchema.methods.deleteDepartment = function(callback) {
    User.find({department: this}, function(err, users) {
      if (users) {
        return callback(null, null);
      }
    });

    this.teams.forEach(function(team) {
        team.remove(callback);
    });

    this.remove(callback);
};

departmentSchema.statics.createDepartment = function(name, teams, callback) {
  "use strict";
  var department = new Department({
    name: name
  });

  for (var i = 0; i < teams.length; i++) {
    var team = new Team({
      name: teams[i].name
    });

    //callback and then not working
    team.save();

    department.teams.push(team);
  }

  department.save(callback);
};

var Department = mongoose.model('Departments', departmentSchema);
//Department.findOne = Q.nbind(Department.findOne.bind(Department));

module.exports = Department;
