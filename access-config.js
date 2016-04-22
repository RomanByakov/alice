'use strict';
var Role = require('./models/role');
var Q = require('q');
let AdminRole = 'Admin';
let UserRole = 'User';

var throwErr = function(err) {
  if (err) {
    throw err;
  }
};

var checkAdminOrSelf = function(user, id) {
  if (user._id != id) {
    return checkAdmin(user);
  } else {
    return true;
  }
};

var checkAdmin = function(user) {
  return Role.checkAccess(getRole(user), AdminRole);
};

var checkUser = function(user) {
  return Role.checkAccess(getRole(user), UserRole);
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
