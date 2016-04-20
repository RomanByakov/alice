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
  logger.debug('[Role::createRole] call with ' + name + ', ' + child);
  var role = new Role({
    name: name
  });

  setChildAndSave(role, child, callback)
  logger.debug('[Role::createRole] end');
};

roleSchema.methods.updateRole = function(name, child, callback) {
  logger.debug('[Role::updateRole] call with ' + name + ', ' + child);
  this.name = name;

  setChildAndSave(this, child, callback);
  logger.debug('[Role::updateRole] call end');
};

var setChildAndSave = function(role, child, callback) {
  logger.debug('[Role::setChildAndSave] call');
  if (child != null) {
    Role.findOne({name: child}, function(err, model) {
      logger.debug('[Role::setChildAndSave] findOne callback');
      if (model) {
        logger.debug('[Role::setChildAndSave] child role find');
        role.child = model;
      }

      role.save(callback);
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
