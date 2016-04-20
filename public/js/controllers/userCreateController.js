angular.module('aliceApp')
.controller('UserCreateController', function($scope, $state, $cookies, $stateParams, User, Role, $window, Upload, $timeout, Department) {

  checkAccess($cookies, $state);
  $scope.user = new User();
  $scope.avatar = null;

  $scope.departments = Department.query();
  $scope.roles = Role.query();
  $scope.teams = [];

  $scope.update = function(department) {
    $scope.teams = JSON.parse(department).teams;
  }

  $scope.addUser = function(avatar) {
    if(avatar == null){
      $scope.user.$save(function() {
          $state.go('users');
      });
    }else{
    avatar.upload = Upload.upload({
      url: '/api/users',
      data: {
        name: $scope.user.name,
        lastname: $scope.user.lastname,
        login: $scope.user.login,
        password: $scope.user.password,
        department: JSON.parse($scope.user.department).name,
        team: $scope.user.team,
        role: $scope.user.role
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

})
