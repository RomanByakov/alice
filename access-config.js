'use strict';
var Role = require('./models/role');
let AdminRole = 'Admin';
let UserRole = 'User';

var throwErr = function(err) {
  if (err) {
    throw err;
  }
};

var checkAdmin = function(role) {
  Role.checkAccess(role, AdminRole, throwErr);
};

var checkUser = function(role) {
  Role.checkAccess(role, UserRole, throwErr);
}

module.exports = {
  'GET': checkUser,
  'POST': checkAdmin,
  'PUT': checkAdmin,
  'DELETE': checkAdmin
};
