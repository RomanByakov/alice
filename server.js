// dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var morgan = require('morgan');
var path = require('path');

var jwt = require('jsonwebtoken');

// models
var User = require('./models/user');
var Team = require('./models/team');
var Department = require('./models/department');
var Role = require('./models/role');

// mongodb
mongoose.connect(config.database);

// express
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// api secret
app.set('apliceSecret', config.token.secret);

app.use(morgan('dev'));

app.use("/", express.static(path.join(__dirname, 'public')));

// start
// todo refactor
app.get('/setup', function(req, res) {
  // clear db
  mongoose.connection.collections['users'].drop( function(err) {
    console.log('users dropped');
  });
  mongoose.connection.collections['teams'].drop( function(err) {
    console.log('teams dropped');
  });
  mongoose.connection.collections['departments'].drop( function(err) {
    console.log('departments dropped');
  });
  mongoose.connection.collections['roles'].drop( function(err) {
    console.log('roles dropped');
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
    if (err) throw err;
    else console.log("roleUser save success!");
  });

  roleAdmin = new Role({
    name: 'Admin',
    child: roleUser
  });

  roleAdmin.save(function(err) {
    if (err) throw err;
    else console.log("roleAdmin save success!");
  });

  User.createUser("test1", "tes1t", "test1", "test1", team, department, roleAdmin, function(err) {
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
      res.json({success: true});
    }
  });
});

app.get('/check-access-test', function(req, res) {
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
});

app.use('/auth', require('./routes/auth'));

// check token
// app.use(function(req, res, next) {
//
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//
//   // decode token
//   if (token) {
//
//     // verifies secret and checks exp
//     jwt.verify(token, app.get('apliceSecret'), function(err, decoded) {
//       if (err) {
//         return res.status(401).json({
//           message: 'Failed to authenticate token.'
//         });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//
//   } else {
//
//     // if there is no token
//     // return an error
//     return res.status(401).send({
//       message: 'Access is denied.'
//     });
//
//   }
//
// });

// routes
app.use('/users', require('./routes/user'));

// start server
app.listen(config.port);
console.log(' alice is running on port 3000');

// error
if (app.get('env') === 'development') {
  app.use('', function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
      stack: err.stack
    });
  });
}
