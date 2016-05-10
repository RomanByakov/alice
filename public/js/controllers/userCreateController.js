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


                        $('#userTeams').dropdown('set visible');
                        $('#userTeams').dropdown('set active');
                        $('#userTeamsMenu').dropdown('set visible');
                        $('#userTeamsMenu').dropdown('set active');
                    }

                    $scope.addTeamToModel = function(team) {
                      $scope.user.team = team.name;
                    };

                    $scope.addRoleToModel = function(role) {
                      $scope.user.role = role.name;
                    };

                    $scope.addUser = function(avatar) {
                        if (!($('.user-form .ui.form').form('is valid'))) {
                          return false;
                        }

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
                                    github: $scope.user.github,
                                    telegram: $scope.user.telegram,
                                    skype: $scope.user.skype,
                                    birthday: $scope.user.birthday,
                                    jobapplydate: $scope.user.jobapplydate,
                                    info: $scope.user.info
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

                $(function() {
                    $('input[name="datetime"]').daterangepicker({
                        singleDatePicker: true,
                        showDropdowns: true,
                        locale: {
                        format: 'MM-DD-YYYY'
                        }
                    });
                  });
                  // Validation Semantic UI
                  var formValidationRules = {
                    fields: {
                    username: {
                      identifier: 'username',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please enter username'
                        }, {
                          type   : 'regExp[/^[a-zA-Z]{3,16}$/]',
                          prompt : 'Please enter a 3-16 letter username without numbers'
                        }]
                    },
                    password: {
                      identifier: 'password',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please enter password'
                        }]
                    },
                    name: {
                      identifier: 'first-name',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please enter your name'
                        }, {
                          type   : 'regExp[/^[a-zA-Zа-яА-Я0-9_-]{3,16}$/]',
                          prompt : 'Please enter a 3-16 letter name'
                        }]
                    },
                    secondname: {
                      identifier: 'second-name',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please enter your second name'
                        }, {
                          type   : 'regExp[/^[a-zA-Zа-яА-Я0-9_-]{3,16}$/]',
                          prompt : 'Please enter a 3-16 letter last name'
                        }]
                    },
                    position: {
                      identifier: 'position',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please enter your position'
                        }]
                    },
                    department: {
                      identifier: 'department',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please select department'
                        }]
                    },
                    teams: {
                      identifier: 'userTeams',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please select team'
                        }]
                    },
                    role: {
                      identifier: 'role',
                      rules: [{
                          type   : 'empty',
                          prompt : 'Please select role'
                        }]
                    },
                    phone: {
                      identifier: 'phone',
                      rules: [{
                          type   : 'exactLength[11]',
                          prompt : 'Telephone number must be 11 characters long'
                        },{
                          type   : 'number',
                          prompt : 'Please enter valid phone number'
                        }]
                    },
                    email: {
                      identifier: 'email',
                      rules: [{
                          type   : 'email',
                          prompt : 'Please enter a valid e-mail'
                        }]
                    },
                    url: {
                      identifier  : 'url',
                      rules: [{
                          type   : 'url',
                          prompt : 'Please enter a valid url'
                        }]
                    },
                    github: {
                      identifier  : 'guthub',
                      rules: [{
                          type   : 'regExp[https:\/\/github.com\/.{1}.*]',
                          prompt : 'Please enter a valid github url'
                        }]
                    }
                  }
                };

                  $('.user-form .ui.form').form(formValidationRules);
            });
