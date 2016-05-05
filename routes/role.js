'use strict';
let express = require('express');
let router = express.Router();

let logger = require('../modules/alice-logger');
let helper = require('../modules/api-helper');

let Role = require('../models/role');

let checkToken = require('../modules/alice-check-token').checkToken;

let getRoles = function(req, res, next) {
  try {
    Role.find()
    .then((roles) => { res.send(roles); })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

let postRole = function(req, res, next) {
  let required = [{
    name: 'name',
    status: true
  }, {
    name: 'child',
    status: false
  }];

  try {
    let params = helper.getParams(required, req);

    Role.createRole(params.name, params.child)
    .then((role) => { res.send(role); })
    .catch((err) => { helper.handleError(res, err); });

  } catch (err) {
    helper.handleError(res, err);
  }
};

let getRole = function(req, res, next) {
  let required = [{
    name: 'id',
    status: true
  }];

  try {
    let params = helper.getParams(required, req);

    Role.findOne({'_id': params.id})
    .then((role) => { res.send(role); })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

let updateRole = function(req, res, next) {
  let required = [{
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
    let params = helper.getParams(required, req);

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
let deleteRole = function(req, res, next) {
  let required = [{
    name: 'id',
    status: true
  }];

  try {
    let params = helper.getParams(required, req);

    Role.remove({'_id': params.id})
    .then(() => {
      res.json({success: true});
    })
    .catch((err) => { helper.handleError(res, err); });
  } catch (err) {
    helper.handleError(res, err);
  }
};

router.route('/')
  .get(checkToken, getRoles)
  .post(checkToken, postRole);

router.route('/:id')
  .get(checkToken, getRole)
  .put(checkToken, updateRole)
  .delete(checkToken, deleteRole);

module.exports = router;
