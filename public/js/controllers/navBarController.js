angular.module('aliceApp').controller('NavBarController', function($rootScope, $scope, $state, $window, $cookies) {
    $rootScope.checkAccess = function($cookies, $state, callback) {
      if (!$cookies.get('user') || !$cookies.get('token')) {
        $state.go('login');
      } else {
        callback();
      }
    };

    $rootScope.colors = {
      'B03060': 'red',
      '0E6EB8': 'blue',
      '000000': 'black',
      'B413EC': 'purple',
      'FE9A76': 'orange',
      'FFD700': 'yellow',
      'FF1493': 'pink',
      '016936': 'green'
    };

    $scope.user = {
      showTooltip: false,
      tipDirection: ''
    };

    $rootScope.update = function() {
      if ($cookies.get('user')) {
        $scope.user = JSON.parse($cookies.get('user'));
      } else {
        $state.go('login');
      }
    }

    if (!$cookies.get('user')) {
        $scope.user.role = {
            name: 'guest'
        };

        $state.go('login');
    } else {
        $scope.user = JSON.parse($cookies.get('user'));

        $scope.logout = () => {
          alert('logout');
          $cookies.remove('token');
          $cookies.remove('user');

          $scope.user.role = {
              name: 'guest'
          };
          $state.go('users', {}, {
              reload: true
          });
        };
    }
});
