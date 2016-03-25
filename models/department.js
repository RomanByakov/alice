// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Team = require('./team');


// schema
var departmentSchema = new mongoose.Schema({
  name: String,
  teams:[Team]
});

// return model
module.exports = restful.model('Departments', departmentSchema);
