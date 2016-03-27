var restful = require('node-restful');
var mongoose = restful.mongoose;

var roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  child: mongoose.Schema.Types.Mixed
});

roleSchema.statics.checkAccess = function(userRole, checkingRole, callback) {
  if (userRole == null) {
    return callback(new Error('Access Denied!'));
  }
  if (userRole.toLowerCase() == checkingRole.toLowerCase()) {
    return true;
  }

  role = this.findOne({name: userRole});
  role = this.findOne({_id: role.child._id});
  checkAccess(role.name, checkingRole, callback);
};

module.exports = restful.model('Roles', roleSchema);
