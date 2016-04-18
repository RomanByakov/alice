angular.module('aliceApp')
  // users controllers
  .controller('UserListController', function($scope, $state, $window, User, $cookies) {

    checkAccess($cookies, $state);

    $scope.users = User.query();

    $scope.getFullDepartment = function(user) {
      if (user.department) {
        return user.department.name + ' + ' + user.team.name;
      } else {
        return '';
      }
    }

    $scope.deleteUser = function(user) {
      user.$delete(function() {
        $window.location.href = '';
      });
    }

  })
