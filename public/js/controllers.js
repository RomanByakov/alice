var module = angular.module('aliceApp.controllers', []);

// users controllers
module.controller('UserListController', function($scope, $state, popupService, $window, User) {

  $scope.users = User.query();

  $scope.deleteUser = function(user) {
    if (popupService.showPopup('Really delete this?')) {
      user.$delete(function() {
        $window.location.href = '';
      });
    }
  }

}).controller('UserViewController', function($scope, $stateParams, User) {

  $scope.user = User.get({
    id: $stateParams.id
  });

}).controller('UserCreateController', function($scope, $state, $stateParams, User) {

  $scope.user = new User();

  $scope.addUser = function() {
    $scope.user.$save(function() {
      $state.go('users');
    });
  }

}).controller('UserEditController', function($scope, $state, $stateParams, User) {

  $scope.updateUser = function() {
    $scope.user.$update(function() {
      $state.go('users');
    });
  };

  $scope.loadUser = function() {
    $scope.user = User.get({
      id: $stateParams.id
    });
  };

  $scope.loadUser();
});

// departments controllers
module.controller('DepartmentListController', function($scope, $state, popupService, $window, Department) {

  $scope.departments = Department.query();

  $scope.deleteUser = function(department) {
    if (popupService.showPopup('Really delete this?')) {
      department.$delete(function() {
        $window.location.href = '';
      });
    }
  }

}).controller('DepartmentViewController', function($scope, $stateParams, Department) {

  $scope.department = Department.get({
    id: $stateParams.id
  });
});
