'use strict';
let mongoose = require('mongoose');

let User = require('../../models/user');
let Team = require('../../models/team');
let Department = require('../../models/department');
let Role = require('../../models/role');

let helper = require('../api-helper');

let Q = require('q');

module.exports.drop = function(req, res, next) {
  //clear db
  mongoose.connection.collections['users'].drop(function(err) {
    if (err) {
      throw err;
    }

    mongoose.connection.collections['roles'].drop(function(err) {
      if (err) {
        throw err;
      }

      mongoose.connection.collections['departments'].drop(function(err) {
        if (err) {
          throw err;
        }

        mongoose.connection.collections['teams'].drop(function(err) {
          if (err) {
            throw err;
          }

          res.json({success: true});
        });
      });
    });
  });


};

//todo: refactor
module.exports.init = function(req, res, next) {
  let roleUser = new Role({
    name: 'User',
    child: null,
    actions: [
      "manageOwn",
      "getUsers",
      "getDepartments"
    ]
  });

  return roleUser.save()
    .then((roleUser) => {
      let roleAdmin = new Role({
        name: 'Admin',
        child: roleUser,
        actions: [
          "createUser",
          "updateUser",
          "getRoles",
          "createDepartment",
          "updateDepartment"
        ]
      });

      return roleAdmin.save();
    })
    .then((roleAdmin) => {
      let roleGod = new Role({
        name: 'God',
        child: roleAdmin,
        actions: [
          "deleteUser",
          "createRole",
          "updateRole",
          "deleteRole",
          "deleteDepartment"
        ]
      });

      return roleGod.save();
    })
    .then(() => {
      let params = {
        name: "Alice",
        lastname: "Simpson",
        username: "Alice",
        password: "Sochno",
        department: null,
        team: null,
        role: "God"
      };

      return User.createUser(params);
    })
    .then((alice) => {
      return res.json({success: true});
    })
    .catch((err) => { helper.handleError(res, err); });
};

module.exports.fillUsers = function(req, res, next) {
  let methods = [];
  for(var i = 0; i < 1000; i++) {
    let name = 'GENERATED' + i;

    let params = {
      name: name,
      lastname: name,
      username: name,
      password:name,
      department: null,
      team: null,
      role: "User"
    };

    methods.push(User.createUser(params));
  }

  Q.all(methods)
  .then(() => { res.json({success: true}); })
  .catch((err) => { helper.handleError(res, err); });
};
