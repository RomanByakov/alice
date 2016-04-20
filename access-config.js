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
  Role.checkAccess(getRole(user), AdminRole, throwErr);
};

var checkUser = function(user) {
  Role.checkAccess(getRole(user), UserRole, throwErr);
}

var getRole = function(user) {
  var role = user.role.name;
  if (!user.role.name) {
    role = user.role;
  }

  return role;
};

module.exports = {
  'GET': checkUser,
  'POST': checkAdmin,
  'PUT': checkAdmin,
  'DELETE': checkAdmin,
  'SELF': checkAdminOrSelf
};
