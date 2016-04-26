angular.module('aliceApp')
    // users controllers
    .controller('UserListController', function($rootScope, $scope, $state, $window, User, $cookies) {
        $rootScope.checkAccess($cookies, $state, function() {
            $rootScope.update();

            $scope.users = User.query();

            $scope.currentUser = JSON.parse($cookies.get('user'));

            $( "#search" ).focus();

            $scope.deleteUser = function(user) {
                user.$delete().then(function() {
                    $state.go('users', {}, {
                        reload: true
                    });
                });
            };

            
            // $scope.$watch("users", function (value) {//I change here
            //   var val = value || null;
            //   if (val)
            //     $('.user-delete-modal')
            //       .modal('attach events', '#logo-container', 'show')
            //     ;
            //   });
        });
    })
