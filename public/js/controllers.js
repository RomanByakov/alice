var module = angular.module('aliceApp.controllers', ['ngTagsInput']);

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

  $scope.deleteDepartment = function(department) {
    if (popupService.showPopup('Really delete this?')) {
      department.$delete(function() {
        //$window.location.href = '';
        $state.go('departments');
      });
    }
  }

}).controller('DepartmentViewController', function($scope, $stateParams, Department) {

  $scope.department = Department.get({
    id: $stateParams.id
  });
}).controller('DepartmentCreateController', function($scope, $state, $stateParams, Department) {

  $scope.department = new Department();
  $scope.department.teams = [];

  $scope.addDepartment = function() {
    $scope.department.$save(function() {
      $state.go('departments');
    });
  }

}).controller('DepartmentEditController', function($scope, $state, $stateParams, Department) {

  $scope.updateDepartment = function() {
    $scope.department.$update(function() {
      $state.go('departments');
    });
  };

  $scope.loadDepartment = function() {
    $scope.department = Department.get({
      id: $stateParams.id
    });
  };

  $scope.loadDepartment();
});

module.controller('LoginController', function($scope, $state, $stateParams, Login) {
  $scope.user = new Login();

  $scope.login = function() {
    $scope.user.$save(function(response) {
      //alert(JSON.stringify(response));
    });
  }
});
