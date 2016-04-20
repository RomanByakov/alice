var module = angular.module('aliceApp.controllers', ['ngTagsInput', 'ngCookies', 'ngFileUpload']);

//baaaaaaad
var checkAccess = function($cookies, $state) {
  if (!$cookies.get('user') || !$cookies.get('token')) {
    $state.go('login');
  }
};

module.controller('NavBarController', function($scope, $state, $window, $cookies) {


  $scope.user = {
    showTooltip: false,
    tipDirection: ''
  };

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



}).controller('UserViewController', function($scope, $state, $cookies, $stateParams, User) {
  checkAccess($cookies, $state);
  $scope.user = User.get({
    id: $stateParams.id
  });

}).controller('UserEditController', function($scope, $state, $cookies, $stateParams, User, Upload, $timeout, Department, Role) {
  checkAccess($cookies, $state);
  $scope.avatar = null;

  $scope.departments = Department.query();
  $scope.roles = Role.query();
  $scope.teams = [];

  $scope.update = function(department) {
    $scope.teams = JSON.parse(department).teams;
  }

  //Правильно прописать модели и можно без этой протыни из каждого поля ъхуярить, а отправлять целиком. Ну это работа для фронтендщика.
  $scope.updateUser = function(avatar) {
    //alert($scope.user.department.name);
    if (avatar) {
      avatar.upload = Upload.upload({
        url: '/api/users/' + $scope.user._id,
        data: {
          _id: $scope.user._id,
          name: $scope.user.name,
          lastname: $scope.user.lastname,
          username: $scope.user.username,
          password: $scope.user.password,
          department: $scope.user.department.name,
          team: $scope.user.team,
          role: $scope.user.role
        },
        headers: {
          'x-access-token': $cookies.get('token')
        },
        file: {
          avatar: avatar
        },
        method: 'PUT'
      });

      avatar.upload.then(function(response) {
        $timeout(function() {
          $state.go('users');
        });
      });
    } else {
      $scope.user.department = $scope.user.department.name;
      alert($scope.user.department);

      $scope.user.$update({
        _id: $scope.user._id,
        name: $scope.user.name,
        lastname: $scope.user.lastname,
        username: $scope.user.username,
        password: $scope.user.password,
        department: $scope.user.department,
        team: $scope.user.team,
        role: $scope.user.role
      }, function() {
        $state.go('users');
      });
    }
  };

  $scope.loadUser = function() {
    $scope.user = User.get({
      id: $stateParams.id
    }, function() {
      $scope.teams = $scope.user.department.teams;
    });
  };


  $scope.loadUser();
  $('.ui.dropdown').dropdown();
});

// departments controllers
module.controller('DepartmentListController', function($scope, $state, $cookies, popupService, $window, Department) {
  checkAccess($cookies, $state);
  $scope.departments = Department.query();

  $scope.departmentSelect = function() {
    alert('asdaswd');
    $scope.$apply();
  };

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
    }, function(err) {
      $scope.error = err.data.message;
    });

  }
});
