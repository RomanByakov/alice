'use strict';
let jwt = require('jsonwebtoken');
let url = require('url');
let accessConfig = require('../../access-config');
let Q = require('q');

let aliceRoles = require('../alice-roles');
let logger = require('../alice-logger');
let secret;
/**
 * @todo: refactor to entry point.
 */
 
/**
 * Simple check token using roles.
 */
let checkToken = (req, res, next) => {
  let token = req.body.token || req.param('token') || req.headers['x-access-token'];

  if (token) {
    try {
      let decoded = jwt.verify(token, secret);

      let parsedUrl = url.parse(req.url, true);
      let pathname = parsedUrl.pathname;
      logger.debug('Pathname: ' + pathname);
      req.decoded = decoded;
      req.currentUser = decoded._doc;

      return Q.fcall(() => {
          if (pathname == '/api/users' && req.params.id != null) {
            return accessConfig['SELF'](req.currentUser, req.params.id);
          } else {
            return accessConfig[req.method](req.currentUser);
          }
      })
      .then(() => { return true; })
      .catch((err) => { res.status(401).json({error: {message: err.message, stack: err.stack}}); });
    } catch (err) {
      res.status(401).json({error: {message: err.message, stack: err.stack}});
    }
  } else {
    return res.status(401).json({message: 'Access is denied.'});
  }
};

let init = (key) => {
  secret = key;
};

module.exports.checkToken = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  return checkToken(req, res, next).then(() => { next(); });
};

module.exports.init = init;
