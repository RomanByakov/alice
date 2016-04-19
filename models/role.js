var restful = require('node-restful');
var mongoose = restful.mongoose;
var logger = require('../modules/alice-logger');

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
  logger.debug("userRole = " + userRole + " checkingRole = " + checkingRole);
  if (userRole == null) {
    return callback(new Error('Access Denied'));
  }

  if (userRole == checkingRole) {
    return callback(null);
  }

  Role.findOne({name: userRole}, function (err, role) {
    logger.debug('into check access find one');
    if (err) return callback(err);

    logger.debug('no errors');
    logger.debug('role ' + role);
    if (role.child) {
      Role.findOne({_id: role.child._id}, function (err, role) {
        logger.debug('into next find one in check access');
        if (err) return callback(err);

        if (role) {
          logger.debug(role.name);
          Role.checkAccess(role.name, checkingRole, callback);
        } else {
          return callback(new Error('Access Denied'));
        }
      });
    } else {
      return callback(new Error('Access Denied'));
    }
  });
};

var Role = mongoose.model('Roles', roleSchema);

module.exports = Role;
