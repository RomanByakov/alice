'use strict';
let Role = require('./models/role');
let Q = require('q');
let AdminRole = 'Admin';
let UserRole = 'User';

let throwErr = function(err) {
  if (err) {
    throw err;
  }
};

let checkAdminOrSelf = function(user, id) {
  if (user._id != id) {
    return checkAdmin(user);
  } else {
    return true;
  }
};

let checkAdmin = function(user) {
  return Role.checkAccess(getRole(user), AdminRole);
};

let checkUser = function(user) {
  return Role.checkAccess(getRole(user), UserRole);
}

let getRole = function(user) {
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
