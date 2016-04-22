angular.module('aliceApp')
    .controller('RoleCreateController', function($rootScope, $scope, $state, $cookies, popupService, $window, Role) {
        $rootScope.checkAccess($cookies, $state, function() {

            $scope.roles = Role.query();

            $scope.role = new Role();

            $scope.addRole = function() {
                $scope.role.child = $scope.role.child.name;
                $scope.role.$save(function() {}, function(err) {
                    $scope.error = err.data.message;
                }).then(function() {
                    $state.go('roles');
                });
            };
        });
    })
