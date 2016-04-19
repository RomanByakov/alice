var fs = require('fs');
var Q = require('q');
var logger = require('../alice-logger');

var uploadAvatar = function (file, user) {
  logger.debug('[upload::uploadAvatar] call');
  if (!file || !file.avatar) {
    logger.debug('[upload::uploadAvatar] avatar missing');
    return Q.call(() => { return false; });
  }

  //todo: extension
  var extension = ".png";

  var path = __dirname + "/../../public/img/avatars/" + user._id + extension;

  return Q.nfcall(fs.rename, file.avatar.path, path)
  .then(function(err) {
    logger.debug('[upload::uploadAvatar] rename file');
    user.avatar = "../img/avatars/" + user._id + extension;

    return user.save()
    .then(function(model) {
      return model;
    })
    .catch(function(err) {
      return false;
    });
  });
};


module.exports.avatar = uploadAvatar;
