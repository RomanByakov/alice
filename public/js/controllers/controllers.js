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
                        _id: $scope.user._id,
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
                    },
                    method: 'PUT'
                });

                avatar.upload.then(function(response) {
                    $timeout(function() {
                        $scope.result = response.data;
                    });
                }, function(responce) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                });
            } else {

                $scope.user.$update({
                    _id: $scope.user._id,
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
                }, function() {
                    $state.go('users');
                });
            }
        };

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
            });
        };


        $scope.loadUser();

        $(function() {

            $('input[name="datetowork"]').daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                  format: 'MM-DD-YYYY'
                }
            });
          });

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

    });
}).controller('DepartmentEditController', function($rootScope, $scope, $state, $cookies, $stateParams, Department, User) {
    $rootScope.checkAccess($cookies, $state, function() {
        $scope.updateDepartment = function() {
            $scope.department.$update(function() {
                $state.go('departments');
            });
        };

        $scope.loadDepartment = function() {
            $scope.department = Department.get({
                id: $stateParams.id
            }, function() {
                $('.ui.dropdown').dropdown();
            });

        };

        $scope.loadDepartment();
        $scope.users = User.query();
        $('.ui.dropdown.multiple')
          .dropdown({
            direction: 'downward'
          })
        ;
        $('.ui.dropdown.fluid')
          .dropdown({
            direction: 'downward'
          })
        ;
        $('.ui.dropdown.icon')
          .dropdown({
            direction: 'upward'
          })
        ;
    });
});

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

    // Form Validation

    //   $('.ui.form')
    //   .form({
    //     fields: {
    //       name: {
    //         identifier: 'login',
    //         rules: [
    //           {
    //             type   : 'empty',
    //             prompt : 'Please enter your login'
    //           }
    //         ]
    //       },
    //       password: {
    //         identifier: 'password',
    //         rules: [
    //           {
    //             type   : 'empty',
    //             prompt : 'Please enter a password'
    //           },
    //           {
    //             type   : 'minLength[6]',
    //             prompt : 'Your password must be at least {ruleValue} characters'
    //           }
    //         ]
    //       },
    //     }
    //   })
    // ;

});
