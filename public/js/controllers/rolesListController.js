angular.module('aliceApp')
    .controller('RolesListController', function($rootScope, $scope, $state, $cookies, popupService, $window, Role) {
        $rootScope.checkAccess($cookies, $state, function() {
            $scope.roles = Role.query();

            $scope.deleteRole = function(role) {
                role.$delete().then(function() {
                    $('.role-delete-modal.modal').modal('hide');
                    $state.go('roles', {}, {
                        reload: true
                    });
                });
            }

            $scope.showPopup = function(role) {
              $scope.roleForDelete = role;
                $('.role-delete-modal.modal').modal('show');
            };

        })
    });
