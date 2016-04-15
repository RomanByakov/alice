angular.module('aliceApp', ['ui.router', 'ngResource', 'ngCookies', 'aliceApp.controllers', 'aliceApp.services', 'ngMaterial']);

angular.module('aliceApp').config(function($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider, $mdThemingProvider) {
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
  //$urlRouterProvider.otherwise("/users");




  $mdThemingProvider.theme('default')
    .primaryPalette('teal', {
      'default': '600', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '600', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '300', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('blue', {
      'default': '400' // use shade 200 for default, and keep all other shades the same
    });

  

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
