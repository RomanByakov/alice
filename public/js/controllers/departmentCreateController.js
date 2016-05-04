angular.module('aliceApp')
    .controller('DepartmentCreateController', function($rootScope, $scope, $state, $cookies, $stateParams, Department, User, Upload, $timeout) {
        $rootScope.checkAccess($cookies, $state, function() {
            $scope.department = new Department();
            $scope.department.teams = [];

            $scope.users = User.query();

            $scope.departmentLogo = null;

            let removeHashKey = (models) => {
              return models.map((item) => {
                delete item['$hashKey'];
                return item;
              });
            };

            $scope.addDepartment = function() {
              if ($scope.departmentLogo) {
                $scope.departmentLogo.upload = Upload.upload({
                    url: '/api/departments/',
                    data: {
                        name: $scope.department.name,
                        phone: $scope.department.phone,
                        description: $scope.department.description,
                        lead: JSON.parse(angular.toJson($scope.department.lead)),
                        color: $scope.department.color,
                        teams: JSON.parse(angular.toJson($scope.department.teams))
                    },
                    headers: {
                        'x-access-token': $cookies.get('token')
                    },
                    file: {
                        logo: $scope.departmentLogo
                    },
                    method: 'POST'
                });

                $scope.departmentLogo.upload.then(function(response) {
                    $timeout(function() {
                        $scope.result = response.data;
                        $state.go('departments');
                    });
                  });
              } else {
                $scope.department.$save(function() {
                    $state.go('departments');
                });
              }
            }

            $scope.addLead = function(user) {
                $scope.department.lead = user;
            }

            $scope.addColor = function(index) {
                $scope.department.color = Object.keys($scope.colors)[index];
            }

            $scope.addTeamColor = function(index) {
                $scope.currentTeam.color = Object.keys($scope.colors)[index];
            }

            $scope.addTeamLead = function(user) {
                $scope.currentTeam.lead = user;
            }

            $scope.deleteTeam = function(index) {
                $scope.department.teams.splice(index, 1);
            }

            $scope.isNewTeam = true;
            $scope.currentTeam = {};

            $scope.newTeam = function() {
                $scope.isNewTeam = true;
                $scope.currentTeam = {};
            }

            $scope.addTeam = function() {
                $scope.department.teams.push($scope.currentTeam);
                $scope.currentTeam = {};
                $('.ui.dropdown.icon').dropdown("restore defaults");
                $('.ui.dropdown.icon').dropdown("set text", "Team color");
            }

            $scope.colors = {
                'B03060': 'red',
                '0E6EB8': 'blue',
                '000000': 'black',
                'B413EC': 'purple',
                'FE9A76': 'orange',
                'FFD700': 'yellow',
                'FF1493': 'pink',
                '016936': 'green'
            };

            $('.ui.dropdown.multiple')
                .dropdown({
                    direction: 'downward'
                });
            $('.ui.dropdown.fluid')
                .dropdown({
                    direction: 'downward'
                });
            $('.ui.dropdown.icon')
                .dropdown({
                    direction: 'upward'
                });


        });
    }).directive('teamsDirective', function() {
        return function(scope, element, attrs) {
            if (scope.$last) {
                $(element).transition({
                    animation: 'scale in',
                    duration: 300
                });
            }
        };
    });
