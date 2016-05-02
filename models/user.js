'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Role = require('./role');
let Team = require('./team');
let Department = require('./department');

let crypto = require('crypto');
let util = require('util');

let Q = require('q');
let logger = require('../modules/alice-logger');
let validators = require('../modules/validators');

let userSchema = new Schema({
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
    default: '../img/empty-img.png'
  },
  skype: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null,
    validate: validators.phoneValidator
  },
  workphone: {
    type: String,
    default: null,
    validate: validators.phoneValidator
  },
  telegram: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null,
    validate: validators.emailValidator
  },
  site: {
    type: String,
    default: null,
    validate: validators.siteValidator
  },
  github: {
    type: String,
    default: null,
    validate: validators.githubValidator
  },
  jobapplydate: {
    type: Date,
    default: new Date('08-25-2014')
  },
  birthday: {
    type: Date,
    default: new Date('08-25-2014')
  },
  position: {
    type: String,
    default: "Slave"
  },
  info: {
    type: String,
    default: null
  }
});

userSchema.methods.checkAccess = function(role, callback) {
  Role.checkAccess(this.role.name, role, callback);
};

userSchema.statics.checkAccess = function(userRole, role, callback) {
  Role.checkAccess(userRole, role, callback);
};

userSchema.statics.createUser = function(params) {
  let user = new User({
    name: params.name,
    lastname: params.lastname,
    username: params.username,
    password: User.hashPassword(params.password),
    skype: params.skype,
    email: params.email,
    site: params.site,
    github: params.github,
    telegram: params.telegram,
    phone: params.phone,
    workphone: params.workphone,
    position: params.position,
    jobapplydate: new Date(params.jobapplydate),
    info: params.info,
    birthday: new Date(params.birthday)
  });

  return Q.fcall(function() {
    return user.setDepartment(params.department, params.team)
  })
  .then(function() {
    return user.setRole(params.role);
  })
  .then(function() {
    logger.debug('[User::createUser] user save');
    return user.save();
  });
};

userSchema.methods.updateUser = function(params) {
  //logger.debug('[User::updateUser] call with ' + department + ', ' + team + ', ' + role);
  let user = this;

  user.username = (params.username == null || params.username == undefined) ? user.username : params.username;
  user.name = params.name;
  user.lastname = params.lastname;
  user.password = (params.password == null || params.password == undefined) ? user.password : User.hashPassword(params.password);
  user.skype = params.skype;
  user.email = params.email;
  user.site = params.site;
  user.github = params.github;
  user.telegram = params.telegram;
  user.phone = params.phone;
  user.workphone = params.workphone;
  user.position = params.position;
  user.jobapplydate = new Date(params.jobapplydate);
  user.info = params.info;
  user.birthday = new Date(params.birthday);

  return Q.fcall(function() {
    return user.setDepartment(params.department, params.team)
  })
  .then(function() {
    return user.setRole(params.role);
  })
  .then(function() {
    logger.debug('[User::updateUser] user save');
    return user.save();
  });
};

userSchema.methods.setDepartment = function(department, team) {
  logger.debug('[User::setDepartment] call with ' + department + ', ' + team);
  let self = this;

  return Department.findOne({name: department})
  .then(function(model) {
    if (model) {
      self.department = model;
      self.setTeam(team);
    }

    logger.debug('[User::setDepartment] then function return');
    return true;
  }).
  catch(function() {
    return true;
  });
};

userSchema.methods.setTeam = function(team) {
  logger.debug('[User::setTeam] call with ' + team);

  let self = this;

  self.department.teams.forEach(function(item) {
    //console.log(item);
    if (item.name == team) {
      logger.debug('[User::setTeam] team is found');
      self.team = item;
    }
  });

  logger.debug('[User::setTeam] end');
  return true;
};

userSchema.methods.setRole = function(role) {
    logger.debug('[User::setRole] call with ' + role);

    let self = this;

    return Role.findOne({name: role})
    .then(function(model) {
      if (model) {
        self.role = model;
      }

      return true;
    })
    .catch(function() {
      return true;
    });
};

userSchema.statics.hashPassword = function(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

userSchema.methods.populate = function() {
  this.username = null;
  this.password = null;
};

userSchema.statics.populateRecords = function(users) {
  users.forEach(function(user) {
    user.populate();
  });
};

let User = mongoose.model('User', userSchema);

module.exports = User;
