'use strict';
let logger = require('../alice-logger');

let isNull = (value) => {
  return value == null || value == 'null';
};

module.exports.emailValidator = [function(val) {
  logger.debug('[Validators::emailValidator] call');

  if (isNull(val)) {
    return true;
  }

  let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(val);
}, 'InvalidEmail'];

module.exports.githubValidator = [function(val) {
  logger.debug('[Validators::githubValidator] call');

  if (isNull(val)) {
      return true;
  }

  let githubRegex = /https:\/\/github.com\/.{1}.*/;
  return githubRegex.test(val);
}, 'InvalidGithubUrl'];

module.exports.phoneValidator = [function(val) {
  logger.debug('[Validators::phoneValidator] call');

  if (isNull(val)) {
    return true;
  }

  let phoneRegex = /^\d{11}$/;
  return phoneRegex.test(val);

}, 'InvalidPhone'];

module.exports.siteValidator = [function(val) {
  logger.debug('[Validators::siteValidator] call');

  if (isNull(val)) {
    return true;
  }

  let siteRegex = /^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/;
  return siteRegex.test(val);

}, 'InvalidSite'];

module.exports.colorValidator = [function(val) {
  logger.debug('[Validators::colorValidator] call');

  if (isNull(val)) {
    return true;
  }

  let colorRegex = /^[0-9A-Fa-f]{6}$/;
  return colorRegex.test(val);
}, 'InvalidColor'];
