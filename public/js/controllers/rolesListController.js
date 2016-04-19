angular.module('aliceApp')
.controller('RolesListController', function($scope, $state, $cookies, popupService, $window, Role) {
  checkAccess($cookies, $state);
  $scope.roles = Role.query();

  $scope.deleteRole = function(role) {
    if (popupService.showPopup('Really delete this?')) {
      role.$delete(function() {
        //$window.location.href = '';
        $state.go('roles');
      });
    }
  }

})
