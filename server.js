var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var morgan = require('morgan');
var path = require('path');
var connectDomain = require('connect-domain');
var multer = require('multer');

var setup = require('./modules/setup');

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
app.use(connectDomain());
//app.use(multer);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// api secret
app.set('apliceSecret', config.token.secret);

app.use(morgan('dev'));

app.use("/", express.static(path.join(__dirname, 'public')));

//setup
app.use('/setup', setup.init);
app.get('/check-access-test', setup.checkAccessTest);

app.use('/auth', require('./routes/auth'));

//check token
// app.use(function(req, res, next) {
//
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//
//   // decode token
//   if (token) {
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
//     return res.status(401).json({
//       message: 'Access is denied.'
//     });
//
//   }
//
// });

// routes
app.use('/api/users', require('./routes/user'));
app.use('/api/departments', require('./routes/department'));
app.use('/api/teams', require('./routes/team'));

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('test');
    if (err) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err,
        stack: err.stack
      });
      console.log("Error handled");
    } else {
      res.json({success: true});
    }
  });
} else {
  app.use(function(err, req, res, next) {
    if (err) {
      res.status(err.status || 500);
      res.json({message: "Something wrong..."});
      console.log(err.message);
      console.log(err.stack);
    } else {
      res.json({success: true});
    }
  });
}

// start server
app.listen(config.port);
console.log(' alice is running on port 3000');
