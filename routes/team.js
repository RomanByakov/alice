var express = require('express');
var router = express.Router();

var Team = require('../models/team');

router.route('/')
  .get(function(req, res, next) {
    Team.find({}, function(err, teams) {
      if (err) throw err;

      res.header("Access-Control-Allow-Origin", "*");
      res.send(teams);
      console.log(teams);
    });
  })
  .post(function(req, res, next) {
    var team = new Team(req.body);
    team.save(function(err, team) {
        if (err) throw err;
        else {
            res.header("Access-Control-Allow-Origin", "*");
            console.log(team);
            res.json(team);
        }
    });
  });

router.route('/:id')
  .get(function(req, res, next) {
    Team.findOne({
      '_id': req.params.id
  }, function(err, team) {
      if (err) throw err;
      res.header("Access-Control-Allow-Origin", "*");
      res.json(team);
      console.log(team);
    });
  })
  .put(function(req, res, next) {
    Team.findOne({
      '_id': req.body._id
  }, function(err, team) {
      if (err) throw err;

      team.name = req.body.name;
      team.save(function(err, team) {
          if (err) throw err;
          else {
              res.header("Access-Control-Allow-Origin", "*");
              res.json(team);
              console.log(team);
          }
      });
      });
    }).delete(function(req, res, next) {
      User.checkAccess(req.currentUser.role.name, 'Admin', function (err) {
          if (err) {
            throw err;
          }
      });

      Team.remove({
        '_id': req.params.id
      }, function(err, removed/*what is?*/) {
        if (err) throw err;

        console.log('Team deleted successfully');
        res.json({success: true});
      });
    });

module.exports = router;
