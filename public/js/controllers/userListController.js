angular.module('aliceApp')
    // users controllers
    .controller('UserListController', function($rootScope, $scope, $state, $window, User, $cookies) {
        $rootScope.checkAccess($cookies, $state, function() {
            $rootScope.update();

            $scope.users = User.query();

            $scope.currentUser = JSON.parse($cookies.get('user'));

            $scope.deleteUser = function(user) {
                user.$delete().then(function() {
                    $state.go('users', {}, {
                        reload: true
                    });
                });
            };
        });

    })
