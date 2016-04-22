var express = require('express');
var router = express.Router();

var logger = require('../modules/alice-logger');
var helper = require('../modules/api-helper');

var Role = require('../models/role');

var getRoles = function(req, res, next) {
  try {
    Role.find()
    .then((roles) => { res.send(roles); })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var postRole = function(req, res, next) {
  var required = [{
    name: 'name',
    status: true
  }, {
    name: 'child',
    status: false
  }];

  try {
    var params = helper.getParams(required, req);

    Role.createRole(params.name, params.child)
    .then((role) => { res.send(role); })
    .catch((err) => { helper.handleError(res, err); });

  } catch (err) {
    helper.handleError(res, err);
  }
};

var getRole = function(req, res, next) {
  var required = [{
    name: 'id',
    status: true
  }];

  try {
    var params = helper.getParams(required, req);

    Role.findOne({'_id': params.id})
    .then((role) => { res.send(role); })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

var updateRole = function(req, res, next) {
  var required = [{
    name: 'id',
    status: true
  }, {
    name: 'name',
    status: true
  }, {
    name: 'child',
    status: false
  }];

  try {
    var params = helper.getParams(required, req);

    Role.findOne()
    .then((role) => {
      role.updateRole(params.name, params.child)
      .then((role) => { res.send(role); })
      .catch((err) => { helper.handleError(res, err); });
    })
    .catch((err) => { helper.handleError(res, err); });

  } catch (err) {
    helper.handleError(res, err);
  }
};

//todo: stop deleting if role is using as child by other roles
var deleteRole = function(req, res, next) {
  var required = [{
    name: 'id',
    status: true
  }];

  try {
    var params = helper.getParams(required, req);

    Role.remove({'_id': params.id})
    .then(() => {
      res.json({success: true});
    })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

router.route('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(getRoles)
  .post(postRole);

router.route('/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(getRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
