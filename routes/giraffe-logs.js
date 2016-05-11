'use strict';
let express = require('express');
let router = express.Router();

let logger = require('../modules/alice-logger');
let helper = require('../modules/api-helper');

let checkToken = require('../modules/alice-check-token').checkToken;
let request = require('request');

let getRoles = function(req, res, next) {
  let required = [{
    name: 'per-page',
    status: false,
  }, {
    name: 'page',
    status: false
  }, {
    name: 'order',
    status: false
  }, {
    name: 'level',
    status: false
  }, {
    name: 'tag',
    status: false
  }, {
    name: 'url',
    status: true
  }, {
    name: 'version',
    status: true
  }];

  let route = 'api/logs/';
  try {
    let params = helper.getParams(required, req);
    request.get({
      url: `${params.url}${params.version}${route}`,
      qs: {
        'per-page': params['per-page'],
        page: params.page,
        order: params.order ? params.order : 'time desc',
        level: params.level,
        tag: params.tag
      }
    }, (error, response, data) => {
      res.send(response.body);
    });
  } catch (err) {
    helper.handleError(res, err);
  }
};

router.route('/')
  .get(checkToken, getRoles);

module.exports = router;
