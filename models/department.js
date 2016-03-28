// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Team = require('./team');


// schema
var departmentSchema = new mongoose.Schema({
  name: String,
  teams:[mongoose.Schema.Types.Mixed]
});

// return model
module.exports = restful.model('Departments', departmentSchema);
