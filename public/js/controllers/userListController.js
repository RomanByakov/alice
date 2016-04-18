angular.module('aliceApp')
  // users controllers
  .controller('UserListController', function($scope, $state, $window, User, $cookies, $mdDialog) {

    checkAccess($cookies, $state);

    $scope.users = User.query();

    $scope.deleteUser = function(user) {
      user.$delete(function() {
        $window.location.href = '';
      });
    }

  })
