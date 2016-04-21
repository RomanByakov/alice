angular.module('aliceApp')
.controller('RoleCreateController', function($scope, $state, $cookies, popupService, $window, Role) {
  checkAccess($cookies, $state);

  $scope.roles = Role.query();

$scope.role = new Role();

  $scope.addRole = function() {
    $scope.role.$save(function() {
    }, function(err) {
      $scope.error = err.data.message;
    }).then(function() {
      $state.go('roles');
    });
  }
})
