var fs = require('fs');
var Q = require('q');
var logger = require('../alice-logger');
var easyimg = require('easyimage');

var uploadAvatar = function (file, user) {
  logger.debug('[upload::uploadAvatar] call');
  if (!file || !file.avatar) {
    logger.debug('[upload::uploadAvatar] avatar missing');
    return Q.fcall(() => { return false; });
  }

  //todo: extension
  var extension = ".png";

  var path = __dirname + "/../../public/img/avatars/" + user._id + extension;

  return easyimg.info(file.avatar.path)
  .then(function(info) {
    var size;

    if (info.height < info.width) {
      size = 224 + (info.width - info.height);
    } else {
      size = 224 + (info.height - info.width);
    }


    return easyimg.rescrop({
       src: file.avatar.path,
       dst: path,
       height: size,
       width: size,
       cropwidth:224,
       cropheight:224,
       x:0,
       y:0
    })
    .then(function(image) {
      logger.debug('[upload::uploadAvatar] file resize and crop');

      user.avatar = "../img/avatars/" + user._id + extension;

      return user.save()
      .then(function(model) {
        return model;
      })
      .catch(function(err) {
        return false;
      });
    }, function (err) {
      logger.debug(err);
    });
  })
  .then((result) => { return result; })
  .catch((err) => { return err; });
};


module.exports.avatar = uploadAvatar;
