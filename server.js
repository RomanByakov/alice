'use strict';
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let Q = require('q');

mongoose.Promise = Q.Promise;

let path = require('path');
let connectDomain = require('connect-domain');
let setup = require('./modules/setup');

// models
let User = require('./models/user');
let Department = require('./models/department');
let Team = require('./models/team');
let Role = require('./models/role');

let app = express();

let config;
if (app.get('env') === 'development') {
  config = require('./config');
} else {
  config = require('./config-prod');
}

mongoose.connect(config.database);

let aliceRoles = require('./modules/alice-roles');
aliceRoles.init(require('./new-access-config'));

let logger = require('./modules/alice-logger');

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});

app.use(connectDomain());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// api secret
app.set('apliceSecret', config.token.secret);

require('./modules/alice-check-token').init(app.get('apliceSecret'));

app.use("/", express.static(path.join(__dirname, 'public')));

app.use('/favicon.ico', function(req, res, next) {
  res.json({favicon: 'empty'});
});

if (app.get('env') === 'development') {
  //setup
  app.use('/drop', setup.drop);
  app.use('/setup', setup.init);
  app.use('/fill', setup.fillUsers);
}

app.use('/api/actions', aliceRoles.getActions);
app.use('/auth', require('./routes/auth'));

// routes
app.use('/api/users', require('./routes/user'));
app.use('/api/departments', require('./routes/department'));
//app.use('/api/teams', require('./routes/team'));
app.use('/api/roles', require('./routes/role'));

// start server
app.listen(config.port);
logger.info(`Alice is running on port ${config.port}`);
