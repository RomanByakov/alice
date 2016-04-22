// dependencies
var express = require('express');
var router = express.Router();

var fs = require('fs');

var upload = require('../modules/upload');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({
  uploadDir: __dirname + "/../public/img/tmp/"
});

var Q = require('q');

//Helpers
var logger = require('../modules/alice-logger');
var helper = require('../modules/api-helper');

// models
var User = require('../models/user');
var Department = require('../models/department');


var getUsers = function(req, res, next) {
  // var required = [{
  //   name: 'select',
  //   status: true
  // }];

  try {
    // var params = helper.getParams(required, req.query);

    User.find()
    .then(function(users) {
      User.populateRecords(users);
      res.send(users);
    })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var getUser = function(req, res, next) {
  try {
    required = [{
      name: 'id',
      status: true
    }];

    var params = helper.getParams(required, req);

    User.findOne({'_id': params.id})
    .then(function(user) {
      user.populate();
      res.send(user);
    })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var postUser = function(req, res, next) {
  var required = [{
    name: 'name',
    status: true
  }, {
    name: 'lastname',
    status: true
  }, {
    name: 'username',
    status: true
  }, {
    name: 'password',
    status: true
  }, {
    name: 'team',
    status: false
  }, {
    name: 'department',
    status: false
  }, {
    name: 'role',
    status: false
  }, {
    name: 'phone',
    status: false
  }, {
    name: 'telegram',
    status: false
  }, {
    name: 'skype',
    status: false
  }, {
    name: 'email',
    status: false
  }, {
    name: 'site',
    status: false
  }, {
    name: 'github',
    status: false
  }, {
    name: 'position',
    status: false
  }, {
    name: 'jobapplydate',
    status: false
  }, {
    name: 'info',
    status: false
  }];

  try {
    var params = helper.getParams(required, req);

    //logger.debug('Params: ' + JSON.stringify(params));

    User.createUser(params)
    .then(function(user) {
      if (req.files) {
        var file = req.files.file;

        upload.avatar(file, user)
        .then(function(result) {
          if (result !== false) {
            result.populate();
            res.send(result);
          } else {
            user.populate();
            res.send(user);
          }
        });
      } else {
        user.populate();
        res.send(user);
      }
    })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var updateUser = function(req, res, next) {
  //logger.debug('[User::PUT] Department is ' + req.body.department);
  logger.debug(req.body);

  var required = [{
    name: 'id',
    status: true
  } ,{
    name: 'name',
    status: true
  }, {
    name: 'lastname',
    status: true
  }, {
    name: 'username',
    status: false
  }, {
    name: 'password',
    status: false
  }, {
    name: 'team',
    status: false
  }, {
    name: 'department',
    status: false
  }, {
    name: 'role',
    status: false
  }, {
    name: 'phone',
    status: false
  }, {
    name: 'telegram',
    status: false
  }, {
    name: 'skype',
    status: false
  }, {
    name: 'email',
    status: false
  }, {
    name: 'site',
    status: false
  }, {
    name: 'github',
    status: false
  }, {
    name: 'position',
    status: false
  }, {
    name: 'jobapplydate',
    status: false
  }, {
    name: 'info',
    status: false
  }];

  try {
    var params = helper.getParams(required, req)

    logger.debug('PARAMS: ' + JSON.stringify(params));

    User.findOne({'_id': params.id})
    .then(function(user) {
      user.updateUser(params)
      .then(function(user) {
        if (req.files) {
          var file = req.files.file;

          upload.avatar(file, user)
          .then(function(result) {
            if (result instanceof User) {
              result.populate();
              res.send(result);
            } else {
              user.populate();
              res.send(user);
            }
          });
        } else {
          user.populate();
          res.send(user);
        }
      })
      .catch((err) => { throw err;});
    })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var deleteUser = function(req, res, next) {
  var required = [{
    name: 'id',
    status: true
  }];

  try {
    var params = helper.getParams(required, req);

    User.remove({'_id': params.id})
    .then(() => { res.json({sucess: true}); })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};




router.route('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(getUsers)
  .post(multipartyMiddleware, postUser);

router.route('/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(getUser)
  .put(multipartyMiddleware, updateUser)
  .delete(deleteUser);

module.exports = router;
