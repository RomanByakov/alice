// dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Role = require('./role');

// create a schema
var userSchema = new Schema({
  name: String,
  lastname: String,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  team: Schema.Types.Mixed,
  department: Schema.Types.Mixed,
  role: Schema.Types.Mixed
});

userSchema.methods.checkAccess = function(role, callback) {
  Role.checkAccess(this.role.name, role, callback);
};

userSchema.statics.createUser = function(firstName, lastName, login, password, team, department, role, callback) {
  var user = new User({
    name: firstName,
    lastname: lastName,
    username: login,
    password: password,
    team: team,
    department: department,
    role: null
  });

  if (role instanceof String) {
    var roleModel = Role.findOne({name: role});

    if (roleModel) {
      role = roleModel;
    }
  } else if (role instanceof Role) {
    user.role = role;
  }

  user.save(callback);
};

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
