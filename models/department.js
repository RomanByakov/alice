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

departmentSchema.methods.updateDepartment = function(name, teamIds, callback) {
  this.name = name;

  Department.getTeams(teamIds, function(err, teams) {
    if (err) return callback(err);

    //if this here is department instance
    this.teams = teams;

    this.save(callback);
  });
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

//teamIds = [ObjectId]
departmentSchema.statics.createDepartment = function(name, teamIds, callback) {
  Department.getTeams(teamIds, function(err, teams) {
    if (err) return callback(err);

    console.log('[createDepartment call] :: after get teams callback');

    var department = new Department({
      name: name,
      teams: teams
    });

    department.save(callback);
  });
};

departmentSchema.statics.getTeams = function(teamIds, callback) {
  var teams = new Array();

  if (teamIds[0] instanceof mongoose.Schema.Types.ObjectId) {
      console.log('[getTeams call] :: before cycle');
      for (var i = 0; i < teamIds.length; i++) {
        Team.findOne({_id: teamIds[i]}, function(err, team) {
          if (err) return callback(err);

          teams[i] = team;
        });
      }
  }

  console.log('[getTeams call] :: after cycle');
  console.log('[getTeams call] :: teams array is ' + teams);

  //i don't know what i'm doing her
  callback (null, teams);
};

departmentSchema.statics.createTeamIdsArray = function(teams, callback) {
  var teamIds = new Array();

  if (teams.length > 0 && teams[0] instanceof Team) {
    for (var i = 0; i < teams.length; i++) {
      teamIds[i] = teams[i]._id;
    }
  }

  callback(null, teamIds);
};

var Department = restful.model('Departments', departmentSchema)

module.exports = Department;
