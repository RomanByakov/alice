var mongoose = require('mongoose');

var User = require('../../models/user');
var Team = require('../../models/team');
var Department = require('../../models/department');
var Role = require('../../models/role');

var Q = require('q');

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
  var roleUser = new Role({
    name: 'User',
    child: null
  });

  roleUser.save(function(err) {
    if (err) {
      throw err;
    }

    roleAdmin = new Role({
      name: 'Admin',
      child: roleUser
    });

    roleAdmin.save(function(err) {
      if (err) {
        throw err;
      }

      roleGod = new Role({
        name: 'God',
        child: roleAdmin
      });

      roleGod.save(function(err) {
        if (err) {
          throw err;
        }

        // User.createUser("Alice", "Simpson", "Alice", "Sochno", null, null, roleGod, function(err, next) {
        //   if (err) {
        //     throw err;
        //   }
        //
        //   res.json({success:true});
        // });

        var params = {
          name: "Alice",
          lastname: "Simpson",
          username: "Alice",
          password: "Sochno",
          department: null,
          team: null,
          role: "God"
        };

        User.createUser(params)
        .then(function() {
          res.json({success: true});
        });
      });
    });
  });
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

module.exports.fillUsers = function(req, res, next) {
  var methods = [];
  for(var i = 0; i < 1000; i++) {
    var name = 'GENERATED' + i;

    var params = {
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
  .catch(() => { res.json({success: false}); });
};
