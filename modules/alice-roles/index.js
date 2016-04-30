'use strict';
var Role = require('../../models/role');
var Actions;
var RouteActionPairs;

var util = require('util');
var Q = require('q');

/**
 * Initialize alice roles with actions array and route-action pairs.
 * @throws Error - invalid config.
 * @param config
 */
var init = (config) => {
  try {
    if (util.isString(config)) {
      init(require(config));
    } else {
      Actions = config.actions;
      RouteActionPairs = config.routeActionPairs;
    }
  } catch(err) {
    throw new Error("InvalidConfig");
  }
};

/**
 * Handle request based on config.
 * @param method - HTTP method (GET, POST, PUT or DELETE)
 * @param url - request url (e.g. /api/users)
 * @param role - valid role
 * @return Q.Promise
 */
var handleRequest = (method, url, role) => {
  return checkAccess(RouteActionPairs[constructRoute(method, url)], role);
};

/**
 * Construct valid route for route-action pairs config.
 * @param method
 * @param url
 * @throws Error - InvalidRoute
 * @return String
 */
var constructRoute = (method, url) => {
  method = method.toUpper();

  var chunks = url.split('/')
  if (chunks.length == 3) {
    return method + " /" + chunks[0] + "/" + chunks[1] + "/:id";
  } else if (chunks.length == 2) {
    return method + " " + url;
  } else {
    throw new Error("InvalidRoute");
  }
};

/**
 * Recursively checking roles and them actions with 'action' param.
 * @param action - name of action
 * @param role - valid role
 * @throws Error - Access Denied
 * @return Q.Promise
 */
var checkAccess = (action, role) => {
  logger.debug("[AliceRoles::checkAccess] action = " + action);
  if (action == null || role == null) {
    return Q.fcall(() => {
        throw new Error("Access Denied! Reason: "
          + action == null ? "action is null; " : ""
          + role == null ? "role is null;" : "");
      });
  }

  if (role.actions.includes(action)) {
    return Q.fcall(() => { return true; });
  }

  return Role.findOne({name: role.name})
    .then((role) => {
      logger.debug("[AliceRoles::checkAccess] role find");

      if (role.child) {
        return Role.findOne({name: role.child.name})
          .then((child) => {
            if (child) {
              return checkAccess(action, child.actions);
            } else {
              return Q.fcall(() => {
                throw new Error("Access Denied! Reason: child role is undefined");
              });
            }
          });
      } else {
        return Q.fcall(() => {
          throw new Error("Access Denied! Reason: action grant not found");
        });
      }
    });
};

/**
 * Middleware for api.
 */
var getActions = (req, res, next) => {
  res.send(Actions);
};

module.exports.init = init;
module.exports.checkAccess = checkAccess;
module.exports.getActions = getActions;
