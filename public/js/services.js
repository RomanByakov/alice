var service = angular.module('aliceApp.services', ['ngCookies']);

// user service
service.factory('User', function($resource, $cookies) {
  return $resource('/api/users/:id', {
    id: '@_id',
    token: function() { return $cookies.get('token'); }
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
service.factory('Department', function($resource, $cookies) {
  return $resource('/api/departments/:id', {
    id: '@_id',
    token: function() { return $cookies.get('token'); }
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

//role service
service.factory('Role', function($resource, $cookies) {
  return $resource('/api/roles/:id', {
    id: '@_id',
    token: function() { return $cookies.get('token'); }
  }, {
    update: {
      method: 'PUT'
    },
    save: {
      method: 'POST'
    }
  });
});

service.factory('Login', function($resource) {
  return $resource('/auth', {
      save: {
        method: 'POST'
      }
  });
});
