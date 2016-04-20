angular.module('aliceApp')
  // users controllers
  .controller('UserListController', function($scope, $state, $window, User, $cookies) {

    checkAccess($cookies, $state);

    $scope.users = User.query();

    $scope.deleteUser = function(user) {
      user.$delete().then(function(){
        $state.go('users', {}, { reload: true });
      });
    }

  })
