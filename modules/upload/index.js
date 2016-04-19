var fs = require('fs');

var uploadAvatar = function (file, user, callback) {
  if (!file || !file.avatar) {
    return;
  }

  //todo: extension
  var extension = ".png";

  var path = __dirname + "/../../public/img/avatars/" + user._id + extension;

  fs.rename(file.avatar.path, path, function(err) {
    if (err) {
      throw err;
    } else {
      user.avatar = "../img/avatars/" + user._id + extension;

      user.save(function(err) {
        if (err) {
          throw err;
        } else {
          callback(user);
        }
      });
    }
  });
};


module.exports.avatar = uploadAvatar;
