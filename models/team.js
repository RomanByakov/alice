var restful = require('node-restful');
var mongoose = restful.mongoose;

var teamSchema = new mongoose.Schema({
  name: [
    type: String,
    required: true,
    unique: true
  ]
});

teamSchema.statics.createTeam = function(name, callback) {

};

module.exports = restful.model('Teams', teamSchema);
