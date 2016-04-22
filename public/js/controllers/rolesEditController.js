angular.module('aliceApp')
    .controller('RoleEditController', function($rootScope, $scope, $state, $cookies, popupService, $window, Role, $stateParams) {
        $rootScope.checkAccess($cookies, $state, function() {
            $scope.updateRole = function() {
                $scope.role.$update(function() {
                    $state.go('roles');
                });
            };

            $scope.roles = Role.query();
            $scope.loadRole = function() {
                $scope.role = Role.get({
                    id: $stateParams.id
                })
            };

            $scope.loadRole();
        })
    })
