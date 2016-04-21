angular.module('aliceApp')
.controller('RoleEditController', function($scope, $state, $cookies, popupService, $window, Role, $stateParams) {
  checkAccess($cookies, $state);
  $scope.updateRole = function() {
    $scope.role.$update(function() {
      $state.go('roles');
    });
  };

$scope.roles = Role.query();
  $scope.loadRole = function() {
    $scope.role = Role.get({
      id: $stateParams.id
    })
  };

  $scope.loadRole();
})
