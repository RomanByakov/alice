angular.module('aliceApp')
    .controller('UserCreateController', function($rootScope, $scope, $state, $cookies, $stateParams, User, Role, $window, Upload, $timeout, Department) {

            $rootScope.checkAccess($cookies, $state, function() {

                    $scope.user = new User();
                    $scope.avatar = null;

                    $scope.departments = Department.query();
                    $scope.roles = Role.query();
                    $scope.teams = [];
                    $(".ui.dropdown").dropdown();

                    $scope.update = function(index) {
                        $scope.user.department = $scope.departments[index].name;
                        $scope.teams = $scope.departments[index].teams;
                    }

                    $scope.addTeamToModel = function(team) {
                      $scope.user.team = team.name;
                    };

                    $scope.addRoleToModel = function(role) {
                      $scope.user.role = role.name;
                    };

                    $scope.addUser = function(avatar) {
                        if (avatar == null) {
                            $scope.user.$save(function() {
                                $state.go('users');
                            });
                        } else {
                            avatar.upload = Upload.upload({
                                url: '/api/users',
                                data: {
                                    name: $scope.user.name,
                                    lastname: $scope.user.lastname,
                                    username: $scope.user.username,
                                    password: $scope.user.password,
                                    department: $scope.user.department,
                                    team: $scope.user.team,
                                    role: $scope.user.role,
                                    position: $scope.user.position,
                                    phone: $scope.user.phone,
                                    email: $scope.user.email,
                                    site: $scope.user.site,
                                    githib: $scope.user.github,
                                    telegram: $scope.user.telegram,
                                    skype: $scope.user.skype
                                },
                                headers: {
                                    'x-access-token': $cookies.get('token')
                                },
                                file: {
                                    avatar: avatar
                                }
                            });

                            avatar.upload.then(function(response) {
                                $timeout(function() {
                                    $state.go('users');
                                });
                            });

                        }
                    }
                });
            })
