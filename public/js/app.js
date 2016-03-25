/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('aliceApp',['ui.router','ngResource','aliceApp.controllers','aliceApp.services']);

angular.module('aliceApp').config(function($stateProvider,$httpProvider){
    $stateProvider.state('users',{
        url:'/users',
        templateUrl:'partials/users.html',
        controller:'UserListController'
    }).state('viewUser',{
       url:'/users/:id/view',
       templateUrl:'partials/user-view.html',
       controller:'UserViewController'
    }).state('newUser',{
        url:'/users/new',
        templateUrl:'partials/user-add.html',
        controller:'UserCreateController'
    }).state('editUser',{
        url:'/users/:id/edit',
        templateUrl:'partials/user-edit.html',
        controller:'UserEditController'
    });
}).run(function($state){
   $state.go('users');
});
