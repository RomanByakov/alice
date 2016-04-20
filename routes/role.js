var express = require('express');
var router = express.Router();

var Role = require('../models/role');

router.route('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    Role.find({}, function(err, roles) {
      if (err) {
         throw err;
       }

      res.json(roles);
    });
  })
  .post(function(req, res, next) {
    Role.createRole(req.body.name, req.body.child.name, function(err, role) {
      if (err) {
        throw err;
      } else {
        res.json(role);
      }
    });
  });

router.route('/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})
  .get(function(req, res, next) {
    Role.findOne({
      '_id': req.params.id
    }, function(err, role) {
      if (err) {
        throw err;
      }

      res.json(role);
    });
  })
  .put(function(req, res, next) {
    Role.findOne({_id: req.body._id}, function(err, role) {
      if (err) {
        throw err;
      } else {
        role.updateRole(req.body.name, req.body.child.name, function(err, role) {
          if (err) {
            throw err;
          } else {
            res.json(role);
          }
        });
      }
    });
  }).delete(function(req, res, next) {
    // Role.findOne({_id: req.body._id}, function(err, role) {
    //   if (err) {
    //     throw err;
    //   } else {
    //     role.remove(function(err) {
    //       if (err) {
    //         throw err;
    //       } else {
    //         res.json({success: true});
    //       }
    //     })
    //   }
    // });
    Role.remove({'_id': req.params.id})
    .then(function() {
      res.json({success: true});
    })
    .catch((err) => { throw err; });
  });

module.exports = router;
