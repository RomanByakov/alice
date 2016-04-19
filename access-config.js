'use strict';
var Role = require('./models/role');
let AdminRole = 'Admin';
let UserRole = 'User';

var throwErr = function(err) {
  if (err) {
    throw err;
  }
};

var checkAdminOrSelf = function(user, id) {
  if (user._id != id) {
    checkAdmin(user);
  } else {
    return true;
  }
};

var checkAdmin = function(user) {
  Role.checkAccess(user.role.name, AdminRole, throwErr);
};

var checkUser = function(user) {
  Role.checkAccess(user.role.name, UserRole, throwErr);
}

module.exports = {
  'GET': checkUser,
  'POST': checkAdmin,
  'PUT': checkAdmin,
  'DELETE': checkAdmin,
  'SELF': checkAdminOrSelf
};
