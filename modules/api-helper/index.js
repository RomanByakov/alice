var logger = require('../alice-logger');
var util = require('util');

/**
 * Check request params for existing and empriness based on required array config.
 * @param Array required. required item is {name: string, status: bool}
 * @param Mixed req
 * @throws Error
 * @return Array
 */
var getParams = function(required, req) {
  logger.debug('[ApiHelper::getParams] call');
  // logger.debug('[ApiHelper::getParams] with query ' + JSON.stringify(req.query));
  // logger.debug('[ApiHelper::getParams] with params ' + JSON.stringify(req.params));
  // logger.debug('[ApiHelper::getParams] with body ' + JSON.stringify(req.body));

  req = getRequestParams(req);

  logger.debug('[ApiHelper::getParams] ' + JSON.stringify(req));

  var result = {};

   for (var i = 0; i < required.length; i++) {
    logger.debug('[ApiHelper::getParams] item ' + required[i].name);
    if ((!req.hasOwnProperty(required[i].name) || isEmpty(req[required[i].name])) && required[i].status) {
      logger.debug('[ApiHelper::getParams] item ' + required[i].name + ' fail check.');
      throw new Error('ParamsMissing');
    }

    result[required[i].name] = req[required[i].name];
    //logger.debug('Result: ' + JSON.stringify(result));
  }

  return result;
};

/**
 * Merge all possible request params (except headers) to one object.
 * @param Object req
 * @return Object result
 */
var getRequestParams = function(req) {
  var result = {};

  for (var attrname in req.query) {
    result[attrname] = req.query[attrname];
  }

  for (var attrname in req.params) {
    result[attrname] = req.params[attrname];
  }

  for (var attrname in req.body) {
    result[attrname] = req.body[attrname];
  }

  return result;
};

/**
 * Check value for emptyness
 * @param Mixed value
 * @return bool result
 */
var isEmpty = function(value) {
  logger.debug('[ApiHelper::isEmpty] call with ' + value);
  // logger.debug('[ApiHelper::isEmpty] ' + value === null);
  // logger.debug('[ApiHelper::isEmpty] ' + value === undefined);
  // logger.debug('[ApiHelper::isEmpty] ' + value.replace(/ /g,'') == '');
  return value === null || value === undefined || (util.isString(value) && value.replace(/ /g,'') == '');
}

var handleError = function(res, err) {
  //temp
  res.status(500);
  res.json({error: {message: err.message, stack: err.stack}});
};

module.exports.getParams = getParams;
module.exports.handleError = handleError;
