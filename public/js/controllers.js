var module = angular.module('aliceApp.controllers', ['ngTagsInput', 'ngCookies']);

//baaaaaaad
var checkAccess = function($cookies, $state) {
  if (!$cookies.get('user') || !$cookies.get('token')) {
    $state.go('login');
  }
};

module.controller('NavBarController', function($scope, $state, $window, $cookies) {
  $scope.user = {};

  if (!$cookies.get('user')) {
    $scope.user.role = 'guest';
    //$window.location.href = '#/login';
    //$state.go('login');
  } else {
    $scope.user = JSON.parse($cookies.get('user'));

    $scope.logout = function() {
      $cookies.remove('token');
      $cookies.remove('user');
      $scope.user.role = 'guest';
    };
  }
});

// users controllers
module.controller('UserListController', function($scope, $state, popupService, $window, User, $cookies) {
  checkAccess($cookies, $state);
  $scope.users = User.query();

  $scope.deleteUser = function(user) {
    if (popupService.showPopup('Really delete this?')) {
      user.$delete(function() {
        $window.location.href = '';
      });
    }
  }

}).controller('UserViewController', function($scope, $state, $cookies, $stateParams, User) {
  checkAccess($cookies, $state);
  $scope.user = User.get({
    id: $stateParams.id
  });

}).controller('UserCreateController', function($scope, $state, $cookies, $stateParams, User) {
  checkAccess($cookies, $state);
  $scope.user = new User();

  $scope.addUser = function() {
    $scope.user.$save(function() {
      $state.go('users');
    });
  }

}).controller('UserEditController', function($scope, $state, $soockies, $stateParams, User) {
  checkAccess($cookies, $state);
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
module.controller('DepartmentListController', function($scope, $state, $cookies, popupService, $window, Department) {
  checkAccess($cookies, $state);
  $scope.departments = Department.query();

  $scope.deleteDepartment = function(department) {
    if (popupService.showPopup('Really delete this?')) {
      department.$delete(function() {
        //$window.location.href = '';
        $state.go('departments');
      });
    }
  }

}).controller('DepartmentViewController', function($scope, $cookies, $stateParams, Department) {
  checkAccess($cookies, $state);
  $scope.department = Department.get({
    id: $stateParams.id
  });
}).controller('DepartmentCreateController', function($scope, $state, $cookies, $stateParams, Department) {
  checkAccess($cookies, $state);
  $scope.department = new Department();
  $scope.department.teams = [];

  $scope.addDepartment = function() {
    $scope.department.$save(function() {
      $state.go('departments');
    });
  }

}).controller('DepartmentEditController', function($scope, $state, $cookies, $stateParams, Department) {
  checkAccess($cookies, $state);
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

module.controller('LoginController', function($scope, $state, $stateParams, $cookies, Login, User) {
  $scope.user = new Login();

  $scope.login = function() {
    $scope.user.$save(function(response) {
      $cookies.put('token', response.token);
      $cookies.put('user', JSON.stringify(response.user));
      $state.go('users');
    });
  }
});
