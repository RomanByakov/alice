var module = angular.module('aliceApp.controllers', ['ngTagsInput', 'ngCookies', 'ngFileUpload', 'ngImgCrop']);

//baaaaaaad
// var checkAccess = function($cookies, $state, callback) {
//   if (!$cookies.get('user') || !$cookies.get('token')) {
//     $state.go('login');
//   } else {
//     callback();
//   }
// };

module.controller('NavBarController', function($rootScope, $scope, $state, $window, $cookies) {

    $rootScope.checkAccess = function($cookies, $state, callback) {
        if (!$cookies.get('user') || !$cookies.get('token')) {
            $state.go('login');
        } else {
            callback();
        }
    };

    $rootScope.colors = {
        'B03060': 'red',
        '0E6EB8': 'blue',
        '000000': 'black',
        'B413EC': 'purple',
        'FE9A76': 'orange',
        'FFD700': 'yellow',
        'FF1493': 'pink',
        '016936': 'green'
    };

    //what is this?
    $scope.user = {
        showTooltip: false,
        tipDirection: ''
    };
    //
    $rootScope.update = function() {
        if ($cookies.get('user')) {
            $scope.user = JSON.parse($cookies.get('user'));
        } else {
            $state.go('login');
        }
    }

    if (!$cookies.get('user')) {
        $scope.user.role = {
            name: 'guest'
        };
        //$window.location.href = '#/login';
        $state.go('login');
    } else {
        $scope.user = JSON.parse($cookies.get('user'));

        $scope.logout = function() {
            $cookies.remove('token');
            $cookies.remove('user');
            $scope.user.role = {
                name: 'guest'
            };
            $state.go('users', {}, {
                reload: true
            });
        };
    }



}).controller('UserViewController', function($rootScope, $scope, $state, $cookies, $stateParams, User) {
    $rootScope.checkAccess($cookies, $state, function() {

        $scope.user = User.get({
            id: $stateParams.id
        }, function() {
            var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
            $scope.days = Math.round(Math.abs((new Date(Date.now()).getTime() - new Date($scope.user.jobapplydate).getTime())/(oneDay)));
        });


    });
}).controller('UserEditController', function($rootScope, $scope, $state, $cookies, $stateParams, User, Upload, $timeout, Department, Role) {
    $rootScope.checkAccess($cookies, $state, function() {
        $scope.avatar = null;

        $scope.departments = Department.query();
        $scope.roles = Role.query();
        $scope.teams = [];

        $scope.roleClass = '';

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

        //Правильно прописать модели и можно без этой протыни из каждого поля ъхуярить, а отправлять целиком. Ну это работа для фронтендщика.
        $scope.updateUser = function(avatar) {
            //alert($scope.user.department.name);
            if (avatar) {
                avatar.upload = Upload.upload({
                    url: '/api/users/' + $scope.user._id,
                    data: {
                        id: $scope.user._id,
                        name: $scope.user.name,
                        lastname: $scope.user.lastname,
                        // username: $scope.user.username,
                        // password: $scope.user.password,
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
                    },
                    method: 'PUT'
                });

                avatar.upload.then(function(response) {
                    $timeout(function() {
                        $scope.result = response.data;
                        $state.go('users');
                    });
                }, function(responce) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                });
            } else {
                $scope.user.$update({
                    id: $scope.user._id,
                    name: $scope.user.name,
                    lastname: $scope.user.lastname,
                    // username: $scope.user.username,
                    // password: $scope.user.password,
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
                }, function() {
                    $state.go('users');
                });
            }
        };

        // let parseDate = (date) => {
        //   // return `${obj.getMonth() + 1}-${obj.getDay()}-${obj.getFullYear()}`;
        //   return new Date(date).format('MM-DD-YYYY');
        // };

        $scope.loadUser = function() {
            $scope.user = User.get({
                id: $stateParams.id
            }, function() {

                //$scope.user.department = $scope.user.department.name;
                //$scope.user.team = $scope.user.team.name;

                $(".ui.dropdown").dropdown("refresh");
                // $($('.ui.dropdown').get(0)).dropdown('set selected',$scope.user.department.name);
                // $($('.ui.dropdown').get(1)).dropdown('set selected',$scope.user.team);
                $($('.ui.dropdown').get(2)).dropdown('set selected', $scope.user.role);
                //$scope.teams = $scope.user.department.teams;

                //$('input[name="datetime"]').val(parseDate($scope.user.birthday));
            });
        };


        $scope.loadUser();

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
          var formValidationRules =
          {
            name: {
              identifier: 'first-name',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your name'
                },
                {
                  type   : 'regExp[/^[a-zA-Zа-яА-Я0-9_-]{3,16}$/]',
                  prompt : 'Please enter a 3-16 letter name'
                }
              ]
            },
            secondname: {
              identifier: 'second-name',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your second name'
                },
                {
                  type   : 'regExp[/^[a-zA-Zа-яА-Я0-9_-]{3,16}$/]',
                  prompt : 'Please enter a 3-16 letter last name'
                }
              ]
            },
            position: {
              identifier: 'position',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your position'
                }
              ]
            },
            department: {
              identifier: 'department',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please select department'
                }
              ]
            },
            teams: {
              identifier: 'userTeams',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please select team'
                }
              ]
            },
            role: {
              identifier: 'role',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please select role'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type   : 'exactLength[11]',
                  prompt : 'Telephone number must be 11 characters long'
                },
                {
                  type   : 'number',
                  prompt : 'Please enter valid phone number'
                }
              ]
            },
            email: {
              identifier: 'email',
              rules: [
                {
                  type   : 'email',
                  prompt : 'Please enter a valid e-mail'
                }
              ]
            },
            url: {
              identifier  : 'url',
              rules: [
                {
                  type   : 'url',
                  prompt : 'Please enter a valid url'
                }
              ]
            },
            github: {
              identifier  : 'guthub',
              rules: [
                {
                  type   : 'regExp[/https:\/\/github.com\/.{1}.*/]',
                  prompt : 'Please enter a valid github url'
                }
              ]
            }
          }

          var formSettings =
          {
          	onSuccess: function () {
              $scope.updateUser($scope.avatar);

          	}
          }

          $('.user-form .ui.form').form(formValidationRules, formSettings);

    });

});

// departments controllers
module.controller('DepartmentListController', function($rootScope, $scope, $state, $cookies, popupService, $window, Department) {
    $rootScope.checkAccess($cookies, $state, function() {

        $scope.departments = Department.query();

        $scope.departmentSelect = function() {
            $scope.$apply();
        };

        $scope.currentUser = JSON.parse($cookies.get('user'));

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
})

module.controller('LoginController', function($scope, $state, $stateParams, $cookies, Login, User) {
    $scope.user = new Login();
    var helloBox = function(){
      $('.hello-box').transition({
        animation : 'scale in',
        duration : '2s'
      });

      $('.login-form').transition({
        animation : 'scale in',
        duration : '1s'
      });
    }
    setTimeout(helloBox, 500);

    $scope.login = function() {
        $scope.user.$save(function(response) {
            $cookies.put('token', response.token);
            $cookies.put('user', JSON.stringify(response.user));
            $state.go('users');
        }, function(err) {
            $scope.error = err.data.message;
        });

    }
});
