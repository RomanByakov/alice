var module = angular.module('aliceApp.controllers', ['ngTagsInput', 'ngCookies', 'ngFileUpload', 'ngImgCrop']);

module.controller('UserViewController', function($rootScope, $scope, $state, $cookies, $stateParams, User) {
    $rootScope.checkAccess($cookies, $state, function() {

        $scope.user = User.get({
            id: $stateParams.id
        }, function() {
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            $scope.days = Math.round(Math.abs((new Date(Date.now()).getTime() - new Date($scope.user.jobapplydate).getTime())/(oneDay)));
        });


    });
});

module.controller('DepartmentListController', function($rootScope, $scope, $state, $cookies, popupService, $window, Department) {
    $rootScope.checkAccess($cookies, $state, function() {

        $scope.departments = Department.query();

        $scope.departmentSelect = function() {
            $scope.$apply();
        };

        $scope.currentUser = JSON.parse($cookies.get('user'));

        $scope.showPopup = function(department) {
          $scope.departmentForDelete = department;
            $('.department-delete-modal.modal').modal('show');
        };

        $scope.deleteDepartment = function(department) {
            // if (popupService.showPopup('Really delete this?')) {
            department.$delete().then(function() {
                $state.go('departments', {}, {
                    reload: true
                });
            });
            // }
        }

        $scope.getColor = (model) => {
          if (model.color) {
            return $rootScope.colors[model.color];
          }

          return $rootScope.colors['016936'];
        };

    });
});
