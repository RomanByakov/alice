angular.module('aliceApp')
    .controller('DepartmentViewController', function($rootScope, $scope, $state, $cookies, $stateParams, Department) {
        $rootScope.checkAccess($cookies, $state, () => {
          $scope.department = Department.get({
              id: $stateParams.id
          });

          $scope.getLeadName = (model) => {
            if (model.lead) {
              return model.lead.name + ' ' + model.lead.lastname;
            }

            return 'No Lead';
          };

          $scope.getColor = (model) => {
            if (model.color) {
              return $rootScope.colors[model.color];
            }

            return $rootScope.colors['016936'];
          };

          $scope.getPhone = (model) => {
            if (model.phone) {
              return '+' + model.phone.substr(0, 1)
                + ' (' + model.phone.substr(1, 3) + ') '
                + model.phone.substr(4, 3) + '-'
                + model.phone.substr(7, 2) + '-'
                + model.phone.substr(9, 2);
            }

            return 'No Phone';
          };
        });
      });
