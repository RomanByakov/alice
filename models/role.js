'use strict';
let mongoose = require('mongoose');
let logger = require('../modules/alice-logger');
let Q = require('q');

let roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  child: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  actions: [String]
});

roleSchema.statics.createRole = function(name, actions, child) {
  logger.debug('[Role::createRole] call with ' + name + ', ' + child);
  let role = new Role({
    name: name,
    actions: actions
  });

  return setChildAndSave(role, child)
  logger.debug('[Role::createRole] end');
};

roleSchema.methods.updateRole = function(name, actions, child) {
  logger.debug('[Role::updateRole] call with ' + name + ', ' + child);
  this.name = name;
  this.actions = actions;

  return setChildAndSave(this, child);
  logger.debug('[Role::updateRole] call end');
};

let setChildAndSave = function(role, child) {
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

let Role = mongoose.model('Roles', roleSchema);

module.exports = Role;
