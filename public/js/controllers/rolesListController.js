angular.module('aliceApp')
.controller('RolesListController', function($scope, $state, $cookies, popupService, $window, Role) {
  checkAccess($cookies, $state);
  $scope.roles = Role.query();

  $scope.deleteRole = function(role) {
      role.$delete().then(function(){
        $state.go('roles', {}, { reload: true });
      });
  }

})
