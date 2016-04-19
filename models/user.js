var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Role = require('./role');
var Team = require('./team');
var Department = require('./department');

var crypto = require('crypto');
var util = require('util');

var userSchema = new Schema({
  name: {
    type: String,
    default: 'Unnamed'
  },
  lastname: {
    type: String,
    default: 'Orphan'
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    index: true
  },
  team: {
    type: Schema.Types.Mixed,
    default: null
  },
  department: {
    type: Schema.Types.Mixed,
    default: null
  },
  role: {
    type: Schema.Types.Mixed,
    default: null
  },
  avatar: {
    type: String,
    default: '../img/empty-img.jpg'
  },
  skype: {
    type: String,
    default: 'Unknown'
  },
  phone: {
    type: Number,
    default: 0
  },
  telegram: {
    type: String,
    default: 'Unknown'
  }
});

userSchema.methods.checkAccess = function(role, callback) {
  Role.checkAccess(this.role.name, role, callback);
};

userSchema.statics.checkAccess = function(userRole, role, callback) {
  Role.checkAccess(userRole, role, callback);
};

userSchema.statics.createUser = function(firstName, lastName, login, password, team, department, role, callback) {
  //todo: validate first and last name for emptyness (spaces only).
  var user = new User({
    name: firstName,
    lastname: lastName,
    username: login,
    password: User.hashPassword(password)
  });


  //console.log(typeof department.name);
  //console.log(department);
  //todo: refactor, check for reflection, synchronize.
  if (util.isString(department)) {
    Department.findOne({name: department}, function(err, model) {
      console.log('[createUser] findOne ...');
      if (model) {
        user.department = model;

        user.setTeam(team);

        user.save();
      }
    });
  } else if (department instanceof Department) {
    user.department = department;

    user.setTeam(team);
  }

  if (util.isString(role)) {
    //console.log('role is string = ' + role);
    Role.findOne({name: role}, function(err, model) {
      if (model) {
        //console.log('role found');
        user.role = model;

        user.save();
      }
    });
  } else if (role instanceof Role) {
    user.role = role;
  }

  user.save(callback);
};

userSchema.methods.updateUser = function(firstName, lastName, login, password, team, department, role, callback) {
  console.log('[updateUser] call with ' + department + ', ' + team + ', ' + role);
  this.username = login === null ? this.username : login;
  this.name = firstName;
  this.lastname = lastName;
  this.password = password === null ? this.password : User.hashPassword(password);

  this.setDepartment(department, team);

  if (util.isString(role)) {
    console.log('[updateUser] role is string');
    Role.findOne({name: role}, function(err, model) {
      console.log('[updateUser] role is found');
      if (model) {
        this.role = model;

        this.save();
      }
    });
  } else if (role instanceof Role) {
    this.role = role;
  }

  this.save(callback);
};

userSchema.methods.setDepartment = function(department, team) {
  console.log('[setDepartment] call with ' + department + ', ' + team);
  if (util.isString(department)) {
    var self = this;
    console.log('[setDepartment] department is string');

    Department.findOne({name: department}, function(err, model) {
      console.log('[setDepartment]::[findOne]');

      if (model) {
        this.department = department;

        this.setTeam(team);

        this.save();
      }
    });
  } else if (department instanceof Department) {
    console.log('[setDepartment] department is Department');
    this.department = department;

    this.setTeam(team);

    this.save();
  }

  console.log('[setDepartment] end');
};

userSchema.methods.setTeam = function(team) {
  console.log('[setTeam] call with ' + team);

  var self = this;

  this.department.teams.forEach(function(item) {
    //console.log(item);
    if (item.name == team) {
      //console.log('team is found');
      self.team = item;
      return true;
    }
  });
};

//todo: make it work.
userSchema.statics.hashPassword = function(password) {
  return crypto.createHash('md5').update(password).digest('hex');
  //return password;
}

userSchema.methods.populate = function() {
  //todo: delete not safe fields based on model config.
  this.username = null;
  this.password = null;
};

userSchema.statics.populateRecords = function(users) {
  users.forEach(function(user) {
    user.populate();
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
