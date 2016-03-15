// dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// schema
var departmentSchema = new mongoose.Schema({
  name: String
});

// return model
module.exports = restful.model('Departments', departmentSchema);
