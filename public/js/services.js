var service = angular.module('aliceApp.services', []);

// user service
service.factory('User', function($resource) {
  return $resource('/api/users/:id', {
    id: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    save: {
      method: 'POST'
    }
  });
}).service('popupService', function($window) {
  this.showPopup = function(message) {
    return $window.confirm(message);
  }
});

// department service
service.factory('Department', function($resource) {
  return $resource('/api/departments/:id', {
    id: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    save: {
      method: 'POST'
    }
  });
}).service('popupService', function($window) {
  this.showPopup = function(message) {
    return $window.confirm(message);
  }
});
