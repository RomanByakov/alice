angular.module('aliceApp')
    .controller('RolesListController', function($rootScope, $scope, $state, $cookies, popupService, $window, Role) {
        $rootScope.checkAccess($cookies, $state, function() {
            $scope.roles = Role.query();

            $scope.deleteRole = function(role) {
                role.$delete().then(function() {
                    $state.go('roles', {}, {
                        reload: true
                    });
                });
            }

        })
    });
