var mongoose = require('mongoose');

var User = require('../../models/user');
var Team = require('../../models/team');
var Department = require('../../models/department');
var Role = require('../../models/role');

//todo: refactor
module.exports.init = function(req, res, next) {
  //clear db
  mongoose.connection.collections['users'].drop(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('users dropped');
    }
  });
  mongoose.connection.collections['teams'].drop(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('teams dropped');
    }
  });
  mongoose.connection.collections['departments'].drop(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('departments dropped');
    }
  });
  mongoose.connection.collections['roles'].drop(function(err) {
    if (err) {
      throw err;
    } else {
      console.log('roles dropped');
    }
  });

  var team = new Team({
    name: "Giraffe"
  });

  team.save(function(err) {
    if (err) {
      throw err;
    } else {
      console.log("team save success!");
    }
  });

  var department = new Department({
    name: "IT",
    teams: [team]
  });

  department.save(function(err) {
    if (err) {
      throw err;
    } else {
      console.log("department save success!");
    }
  });

  var roleUser = new Role({
    name: 'User',
    child: null
  });

  roleUser.save(function(err) {
    if (err) {
      throw err;
    } else {
      console.log("roleUser save success!");
    }
  });

  roleAdmin = new Role({
    name: 'Admin',
    child: roleUser
  });

  roleAdmin.save(function(err) {
    if (err) {
      throw err;
    } else {
      console.log("roleAdmin save success!");
    }
  });

  User.createUser("test1", "tes1t", "test1", "test1", team, department, roleAdmin, function(err, next) {
    if (err) {
      throw err;
    } else {
      console.log("user save success!");
    }
  });
  User.createUser("test2", "test2", "test2", "test2", team, department, roleUser, function(err) {
    if (err) {
      throw err;
    } else {
      console.log("user save success!");
    }
  });
  User.createUser("test3", "test3", "test3", "test3", team, department, roleUser, function(err) {
    if (err) {
      throw err;
    } else {
      console.log("user save success!");
    }
  });

  res.json({success: true});
};

module.exports.checkAccessTest = function(req, res, next) {
  console.log('check-access');
  User.findOne({username: "test1"}, function (err, user) {
    if (err) throw err;

    if (user != null) {
      console.log('user = ' + user.name);

      user.checkAccess("Admin", function (err) {
        if (err) throw err;
        else {
          console.log("access granted");
          res.json({success: true});
        }
      });
    }
  });

  User.findOne({username: "test3"}, function (err, user) {
    if (err) throw err;

    if (user != null) {
      console.log('user = ' + user.name);

      user.checkAccess("Admin", function (err) {
        if (err) throw err;
        else {
          console.log("access granted");
          res.json({success: true});
        }
      });
    }
  });
};
