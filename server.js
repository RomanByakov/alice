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
  var team = new Team({
    name: "Giraffe"
  });
  var department = new Department({
    name: "IT",
    teams: [new Object({
      name: 'Giraffe'
    })]
  });
  // department.save(function(err) {
  //   if (err) throw err;
  // });
  // team.save(function(err) {
  //   if (err) throw err;
  // });
  // create a sample user
  var nick = new User({
    name: 'Roman',
    lastname: 'Byakov',
    username: 'roman',
    password: 'password',
    team: new Object({
      id: 123,
      name: 'Giraffe'
    }),
    department: new Object({
      id: 666,
      name: 'IT'
    })
  });
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({
      success: true
    });
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
console.log(' alice is running om port 3000');

// error
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
