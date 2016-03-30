angular.module('aliceApp', ['ui.router', 'ngResource', 'aliceApp.controllers', 'aliceApp.services']);

angular.module('aliceApp').config(function($stateProvider, $httpProvider, $locationProvider) {
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
    });

    //$locationProvider.html5Mode(true);
}).run(function($state) {
  $state.go('users');
});
