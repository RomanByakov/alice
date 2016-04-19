var restful = require('node-restful');
var mongoose = restful.mongoose;

var roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  child: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
});

roleSchema.statics.createRole = function(name, child, callback) {
  var role = new Role({
    name: name
  });

  setChildAndSave(role, child, callback)
};

roleSchema.methods.updateRole = function(name, child, callback) {
  this.name = name;

  setChildAndSave(this, child, callback);
};

var setChildAndSave = function(role, child, callback) {
  if (child != null) {
    Role.findOne({name: child}, function(err, model) {
      if (model) {
        role.child = model;

        role.save(callback);
      }
    });
  } else {
    role.save(callback);
  }
}

roleSchema.statics.checkAccess = function(userRole, checkingRole, callback) {
  if (userRole == null) {
    return callback(new Error('Access Denied'));
  }

  //console.log("userRole = " + userRole + " checkingRole = " + checkingRole);
  if (userRole == checkingRole) {
    return callback(null);
  }


  this.findOne({name: userRole}, function (err, role) {
    if (err) return callback(err);

    if (role.child) {
      this.findOne({_id: role.child._id}, function (err, role) {
        if (err) return callback(err);

        if (role) {
          checkAccess(role.name, checkingRole, callback);
        } else {
          return callback(new Error('Access Denied'));
        }
      });
    } else {
      return callback(new Error('Access Denied'));
    }
  });
};

var Role = restful.model('Roles', roleSchema);

module.exports = Role;
