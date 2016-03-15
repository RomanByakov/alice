// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// schema
var teamSchema = new mongoose.Schema({
  name: String
});

// return model
module.exports = restful.model('Teams', teamSchema);
