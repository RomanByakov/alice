'use strict';
let fs = require('fs');
let Q = require('q');
let logger = require('../alice-logger');
let easyimg = require('easyimage');

/**
 * @todo: REFACTOR
 */

let uploadAvatar = function (file, user) {
  logger.debug('[upload::uploadAvatar] call');
  if (!file || !file.avatar) {
    logger.debug('[upload::uploadAvatar] avatar missing');
    return Q.fcall(() => { return false; });
  }

  //todo: extension
  let extension = ".png";

  let path = __dirname + "/../../public/img/avatars/" + user._id + extension;

  return easyimg.info(file.avatar.path)
  .then(function(info) {
    let size;

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

let uploadDepartemntLogo = function (file, department) {
  logger.debug('[upload::uploadDepartemntLogo] call');
  if (!file || !file.logo) {
    logger.debug('[upload::uploadDepartemntLogo] logo missing');
    return Q.fcall(() => { return false; });
  }

  //todo: extension
  let extension = ".png";

  let path = __dirname + "/../../public/img/logos/departments/" + department._id + extension;

  return easyimg.info(file.logo.path)
  .then(function(info) {
    let size;

    if (info.height < info.width) {
      size = 224 + (info.width - info.height);
    } else {
      size = 224 + (info.height - info.width);
    }


    return easyimg.rescrop({
       src: file.logo.path,
       dst: path,
       height: size,
       width: size,
       cropwidth:224,
       cropheight:224,
       x:0,
       y:0
    })
    .then(function(image) {
      logger.debug('[upload::uploadDepartemntLogo] file resize and crop');

      department.logo = "../img/logos/departments/" + department._id + extension;

      return department.save()
      .then(function(model) {
        return model;
      })
      // .catch(function(err) {
      //   return false;
      // });
    }, function (err) {
      logger.debug(err);
    });
  })
  .then((result) => { return result; })
  .catch((err) => { return err; });
};

let uploadTeamLogo = function (file, team) {
  logger.debug('[upload::uploadTeamLogo] call');
  if (!file || !file.logo) {
    logger.debug('[upload::uploadTeamLogo] logo missing');
    return Q.fcall(() => { return false; });
  }

  //todo: extension
  let extension = ".png";

  let path = __dirname + "/../../public/img/logos/teams/" + team._id + extension;

  return easyimg.info(file.logo.path)
  .then(function(info) {
    let size;

    if (info.height < info.width) {
      size = 224 + (info.width - info.height);
    } else {
      size = 224 + (info.height - info.width);
    }


    return easyimg.rescrop({
       src: file.logo.path,
       dst: path,
       height: size,
       width: size,
       cropwidth:224,
       cropheight:224,
       x:0,
       y:0
    })
    .then(function(image) {
      logger.debug('[upload::uploadTeamLogo] file resize and crop');

      team.logo = "../img/logos/teams/" + team._id + extension;

      return team.save()
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
module.exports.departmentLogo = uploadDepartemntLogo;
module.exports.teamLogo = uploadTeamLogo;
