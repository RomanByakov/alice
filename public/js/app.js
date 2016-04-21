angular.module('aliceApp', ['ui.router', 'ngResource', 'ngCookies', 'aliceApp.controllers', 'aliceApp.services']);

angular.module('aliceApp').config(function($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider) {
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  //$urlRouterProvider.otherwise("/users");

  $stateProvider
  // users
    .state('users', {
      url: '/users',
      templateUrl: 'partials/users.html',
      controller: 'UserListController'
    }).state('viewUser', {
      url: '/users/view/:id',
      templateUrl: 'partials/user-view.html',
      controller: 'UserViewController'
    }).state('newUser', {
      url: '/users/new',
      templateUrl: 'partials/user-add.html',
      controller: 'UserCreateController'
    }).state('editUser', {
      url: '/users/edit/:id',
      templateUrl: 'partials/user-edit.html',
      controller: 'UserEditController'
    })
    // departments
    .state('departments', {
      url: '/departments',
      templateUrl: 'partials/departments.html',
      controller: 'DepartmentListController'
    }).state('viewDepartment', {
      url: '/departments/:id/view',
      templateUrl: 'partials/department-view.html',
      controller: 'DepartmentViewController'
    }).state('newDepartment', {
      url: '/departments/new',
      templateUrl: 'partials/department-add.html',
      controller: 'DepartmentCreateController'
    }).state('editDepartment', {
      url: '/departments/edit/:id',
      templateUrl: 'partials/department-edit.html',
      controller: 'DepartmentEditController'
    })
    // roles
    .state('roles', {
      url: '/roles',
      templateUrl: 'partials/roles.html',
      controller: 'RolesListController'
    })
    .state('newRole', {
      url: '/roles/new',
      templateUrl: 'partials/role-add.html',
      controller: 'RoleCreateController'
    })
    .state('editRole', {
      url: '/roles/edit/:id',
      templateUrl: 'partials/role-edit.html',
      controller: 'RoleEditController'
    })
    //auth
    .state('login', {
      url: 'login',
      templateUrl: 'partials/login.html',
      controller: 'LoginController'
    });
}).run(function($state, $cookies) {
  if ($cookies.get('user')) {
    $state.go('users');
  } else {
    $state.go('login');
  }
});
