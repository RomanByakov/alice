var restful = require('node-restful');
var mongoose = restful.mongoose;

var teamSchema = new mongoose.Schema({
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
});

teamSchema.statics.createTeam = function(name, callback) {
  var team = new Team({
    name: name
  });

  team.save(function (err, team) {
    if (err) {
      callback(err);
    } else {
      callback(null, team);
    }
  });
};

var Team = mongoose.model('Teams', teamSchema);

module.exports = Team;
