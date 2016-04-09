var restful = require('node-restful');
var mongoose = restful.mongoose;

var teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

teamSchema.statics.createTeam = function(name, callback) {
  var team = new Team({
    name: name
  });

  team.save(function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, team);
    }
  });
};

var Team = restful.model('Teams', teamSchema);

module.exports = Team;
