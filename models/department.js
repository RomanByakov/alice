// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Team = require('./team');
var User = require('./user');

var departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  teams:[mongoose.Schema.Types.Mixed]
});

//not working
departmentSchema.methods.updateDepartment = function(name, teams, callback) {
  this.name = name;

  var teamCallback = function(err) {
    if (err) {
      callback(err);
    }
  };

  //-_________-
  teams.forEach(function(item) {
    Team.createTeam(item.name, teamCallback);
    Team.findOne({name: item.name}, function(err, team) {
      if (err) {
        callback(err);
      } else {
        this.teams.push(team);
      }
    });
  });

  this.save(callback);
};

departmentSchema.methods.deleteDepartment = function(callback) {
    //todo: check in users
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

var Department = restful.model('Departments', departmentSchema)

module.exports = Department;
