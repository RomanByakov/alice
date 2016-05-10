angular.module('aliceApp')
    .controller('DepartmentEditController', function($rootScope, $scope, $state, $cookies, $stateParams, Department, User, Upload, $timeout) {
        $rootScope.checkAccess($cookies, $state, function() {
            $scope.updateDepartment = function() {
              if (!($('.department-form').form('is valid'))) {
                return false;
              }

              if ($scope.departmentLogo) {
                $scope.departmentLogo.upload = Upload.upload({
                    url: '/api/departments/' + $scope.department._id,
                    data: {
                        id: $scope.department._id,
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
                    method: 'PUT'
                });

                $scope.departmentLogo.upload.then(function(response) {
                    $timeout(function() {
                        $scope.result = response.data;
                        $state.go('departments');
                    });
                  });
              } else {
                $scope.department.$update(function() {
                    $state.go('departments');
                });
              }
            };

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
            //$scope.currentIndex = null;
            $scope.currentTeam = {};

            $scope.newTeam = function() {
                $scope.isNewTeam = true;
                $scope.currentTeam = {};
            }

            $scope.addTeam = () => {
              if (!($('.team-form').form('is valid'))) {
                return false;
              }

              if ($scope.isNewTeam) {
                $scope.department.teams.push($scope.currentTeam);
              }

              $scope.currentTeam = {};
              $('.ui.dropdown.icon').dropdown("restore defaults");
              $('.ui.dropdown.icon').dropdown("set text", "Team color");

            }

            //Teams validation
            var teamsFormVR = {
              fields: {
                name: {
                  identifier: 'team-name',
                  rules: [{
                      type   : 'empty',
                      prompt : 'Please enter your name'
                    }, {
                      type   : 'regExp[/^[a-zA-Zа-яА-Я0-9_-]{3,16}$/]',
                      prompt : 'Please enter a 3-16 letter name'
                    }]
                },
                phone: {
                  identifier: 'team-phone',
                  rules: [{
                      type   : 'exactLength[11]',
                      prompt : 'Telephone number must be 11 characters long'
                    }, {
                      type   : 'number',
                      prompt : 'Please enter valid phone number'
                    }]
                }
              }
            };

            $('.team-form').form(teamsFormVR);

            //Department validation
            var departmentFormVR = {
              fields: {
                name: {
                  identifier: 'department-name',
                  rules: [{
                      type   : 'empty',
                      prompt : 'Please enter your name'
                    }, {
                      type   : 'regExp[/^[a-zA-Zа-яА-Я0-9_-]{2,16}$/]',
                      prompt : 'Please enter a 3-16 letter name'
                    }]
                },
                phone: {
                  identifier: 'department-phone',
                  rules: [{
                      type   : 'exactLength[11]',
                      prompt : 'Telephone number must be 11 characters long'
                    },{
                      type   : 'number',
                      prompt : 'Please enter valid phone number'
                    }]
                }
              }
            };

            $('.department-form').form(departmentFormVR);

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

            $scope.loadDepartment = function() {
                $scope.department = Department.get({
                    id: $stateParams.id
                }, function() {
                    $('.ui.dropdown').dropdown();
                });
            };

            $scope.editTeam = (team) => {
              $scope.currentTeam = team;
              //$scope.currentIndex = index;
              $scope.isNewTeam = false;
            };

            $scope.loadDepartment();
            $scope.users = User.query();
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

            $scope.getTeamHeader = () => {
              if (!$scope.isNewTeam) {
                return 'Update Team';
              }

              return 'Add New Team';
            };
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
