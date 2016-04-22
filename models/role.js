var restful = require('node-restful');
var mongoose = restful.mongoose;
var logger = require('../modules/alice-logger');
var Q = require('q');

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

roleSchema.statics.createRole = function(name, child) {
  logger.debug('[Role::createRole] call with ' + name + ', ' + child);
  var role = new Role({
    name: name
  });

  return setChildAndSave(role, child)
  logger.debug('[Role::createRole] end');
};

roleSchema.methods.updateRole = function(name, child) {
  logger.debug('[Role::updateRole] call with ' + name + ', ' + child);
  this.name = name;

  return setChildAndSave(this, child);
  logger.debug('[Role::updateRole] call end');
};

var setChildAndSave = function(role, child) {
  logger.debug('[Role::setChildAndSave] call');
  if (child != null) {
    return Role.findOne({name: child})
    .then((model) => {
      logger.debug('[Role::setChildAndSave] child role find');
      role.child = model;

      return role.save();
    });
  } else {
    return role.save();
  }
}

roleSchema.statics.checkAccess = function(userRole, checkingRole) {
  logger.debug("[Role::checkAccess] userRole = " + userRole + " checkingRole = " + checkingRole);
  if (userRole == null) {
    throw new Error('Access Denied');
  }

  if (userRole == checkingRole) {
    logger.debug('[Role::checkAccess] return true');
    return Q.fcall(() => { return true; });
    //return true;
  }

  return Role.findOne({name: userRole})
  .then((role) => {
    logger.debug('iRole::checkAccess] into check access find one role ' + role);
    if (role.child) {
      //maybe call findOne again
      return Role.checkAccess(role.child.name, checkingRole);
    } else {
      //return Q.fcall(() => { return false; });
      throw new Error('Access Denied');
    }
  });
};

var Role = mongoose.model('Roles', roleSchema);

module.exports = Role;
