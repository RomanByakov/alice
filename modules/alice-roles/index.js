'use strict';
var Role = require('../../models/role');
var Actions = require('./actions');

var Q = require('q');

var checkAccess = (action) => {
  
};

// roleSchema.statics.checkAccess = function(userRole, checkingRole) {
//   logger.debug("[Role::checkAccess] userRole = " + userRole + " checkingRole = " + checkingRole);
//   if (userRole == null) {
//     throw new Error('Access Denied');
//   }
//
//   if (userRole == checkingRole) {
//     logger.debug('[Role::checkAccess] return true');
//     return Q.fcall(() => { return true; });
//     //return true;
//   }
//
//   return Role.findOne({name: userRole})
//   .then((role) => {
//     logger.debug('iRole::checkAccess] into check access find one role ' + role);
//     if (role.child) {
//       //maybe call findOne again
//       return Role.checkAccess(role.child.name, checkingRole);
//     } else {
//       //return Q.fcall(() => { return false; });
//       throw new Error('Access Denied');
//     }
//   });
// };
