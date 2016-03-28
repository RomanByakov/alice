// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Team = require('./team');

var departmentSchema = new mongoose.Schema({
  name: String,
  teams:[mongoose.Schema.Types.Mixed]
});

departmentSchema.methods.updateDepartment = function(name, teamIds, callback) {
  this.name = name;

  Department.getTeams(teamIds, function(err, teams) {
    if (err) return callback(err);

    //if this here is department instance
    this.teams = teams;

    this.save(callback);
  });
};

departmentSchema.statics.createDepartment = function(name, teamIds, callback) {
  Department.getTeams(teamIds, function(err, teams) {
    if (err) return callback(err);

    var department = new Department({
      name: name,
      teams: teams
    });

    department.save(callback);
  });
};

departmentSchema.statics.getTeams = function(teamIds, callback) {
  var teams = new Array();

  for (var i = 0; i < teamIds.length; i++) {
    Team.findOne({_id: teamIds[i]}, function(err, team) {
      if (err) return callback(err);

      teams[i] = team;
    });
  }

  //i don't know what i'm doing her
  callback (null, teams);
};

var Department = restful.model('Departments', departmentSchema)

module.exports = Department;
