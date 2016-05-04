'use strict';
// dependencies
let express = require('express');
let router = express.Router();

let fs = require('fs');

let upload = require('../modules/upload');

let multiparty = require('connect-multiparty');
let multipartyMiddleware = multiparty({
  uploadDir: __dirname + "/../public/img/tmp/"
});

let Q = require('q');

//Helpers
let logger = require('../modules/alice-logger');
let helper = require('../modules/api-helper');

// models
let User = require('../models/user');
let Department = require('../models/department');


let getUsers = function(req, res, next) {
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

let getUser = function(req, res, next) {
  try {
    let required = [{
      name: 'id',
      status: true
    }];

    let params = helper.getParams(required, req);

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

let postUser = function(req, res, next) {
  try {
    let params = helper.getParams(User.postRequired(), req);

    //logger.debug('Params: ' + JSON.stringify(params));

    User.createUser(params)
    .then(function(user) {
      if (req.files) {
        let file = req.files.file;

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

let updateUser = function(req, res, next) {
  //logger.debug('[User::PUT] Department is ' + req.body.department);
  logger.debug(req.body);

  try {
    let params = helper.getParams(User.updateRequired(), req)

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
      .catch((err) => { helper.handleError(res, err); });
    })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

let deleteUser = function(req, res, next) {
  let required = [{
    name: 'id',
    status: true
  }];

  try {
    let params = helper.getParams(required, req);

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
