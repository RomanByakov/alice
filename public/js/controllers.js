var module = angular.module('aliceApp.controllers', ['ngTagsInput', 'ngCookies', 'ngFileUpload']);

//baaaaaaad
var checkAccess = function($cookies, $state) {
  if (!$cookies.get('user') || !$cookies.get('token')) {
    $state.go('login');
  }
};

module.controller('NavBarController', function($scope, $state, $window, $cookies) {


  $scope.user = {
    showTooltip : false,
    tipDirection : ''
  };

  if (!$cookies.get('user')) {
    $scope.user.role = 'guest';
    //$window.location.href = '#/login';
    //$state.go('login');
  } else {
    $scope.user = JSON.parse($cookies.get('user'));

    $scope.logout = function() {
      $cookies.remove('token');
      $cookies.remove('user');
      $scope.user.role = 'guest';
    };
  }

  // User popup init

  $('.top-bar_user .teal')
  .popup({
    popup : $('.user-menu'),
    on: 'click',
    position : 'bottom left'
  })
;



  // $scope.user.delayTooltip = undefined;
  // $scope.$watch('user.delayTooltip',function(val) {
  //   $scope.user.delayTooltip = parseInt(val, 10) || 0;
  // });
  // $scope.$watch('user.tipDirection',function(val) {
  //   if (val && val.length ) {
  //     $scope.user.showTooltip = true;
  //   }

});

// users controllers
module.controller('UserListController', function($scope, $state, popupService, $window, User, $cookies, $mdDialog) {

  checkAccess($cookies, $state);
  $scope.users = User.query();

  $scope.openModal = function(user) {
    $mdDialog.show({
      templateUrl: '../partials/user-form.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true
    }

      // .parent(angular.element(document.querySelector('#popupContainer')))
      // .title('This is an alert title')
      // .textContent('You can specify some description text in here.')
    );
    $scope.user = user;
  };

$scope.deleteUser = function(user) {
  user.$delete(function()
  {
      $window.location.href = '';
  });
}

}).controller('UserViewController', function($scope, $state, $cookies, $stateParams, User) {
  checkAccess($cookies, $state);
  $scope.user = User.get({
    id: $stateParams.id
  });

}).controller('UserCreateController', function($scope, $state, $cookies, $stateParams, User, $window, Upload, $timeout, Department) {
  checkAccess($cookies, $state);
  $scope.user = new User();
  $scope.avatar = null;

  $scope.departments = Department.query();

  $scope.addUser = function(avatar) {
    avatar.upload = Upload.upload({
      url: '/api/users',
      data: {
        name: $scope.user.name,
        lastname: $scope.user.lastname,
        login: $scope.user.login,
        password: $scope.user.password,
        department: $scope.user.department,
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
      $timeout(function () {
        $window.location.href = '';
      });
    });
  }

}).controller('UserEditController', function($scope, $state, $cookies, $stateParams, User, Upload, $timeout) {
  checkAccess($cookies, $state);

  $scope.user = new User();
  $scope.avatar = null;

  //Правильно прописать модели и можно без этой протыни из каждого поля ъхуярить, а отправлять целиком. Ну это работа для фронтендщика.
  $scope.updateUser = function(avatar) {
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
        role: $scope.user.role
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
      $timeout(function () {
        $state.go('users');
      });
    });
  };

    $scope.loadUser = function() {
      $scope.user = User.get({
        id: $stateParams.id
      });
    };

    $scope.loadUser();
});

// departments controllers
module.controller('DepartmentListController', function($scope, $state, $cookies, popupService, $window, Department) {
  checkAccess($cookies, $state);
  $scope.departments = Department.query();

  $scope.departmentSelect = function() {
    alert('asdaswd');
    $scope.$apply();
  };

  $scope.deleteDepartment = function(department) {
    if (popupService.showPopup('Really delete this?')) {
      department.$delete(function() {
        //$window.location.href = '';
        $state.go('departments');
      });
    }
  }

}).controller('DepartmentViewController', function($scope, $cookies, $stateParams, Department) {
  checkAccess($cookies, $state);
  $scope.department = Department.get({
    id: $stateParams.id
  });
}).controller('DepartmentCreateController', function($scope, $state, $cookies, $stateParams, Department) {
  checkAccess($cookies, $state);
  $scope.department = new Department();
  $scope.department.teams = [];

  $scope.addDepartment = function() {
    $scope.department.$save(function() {
      $state.go('departments');
    });
  }

}).controller('DepartmentEditController', function($scope, $state, $cookies, $stateParams, Department) {
  checkAccess($cookies, $state);
  $scope.updateDepartment = function() {
    $scope.department.$update(function() {
      $state.go('departments');
    });
  };

  $scope.loadDepartment = function() {
    $scope.department = Department.get({
      id: $stateParams.id
    });
  };

  $scope.loadDepartment();
});

module.controller('LoginController', function($scope, $state, $stateParams, $cookies, Login, User) {
  $scope.user = new Login();

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

module.controller('SideBarController', function($scope, $state, $window, $cookies, $timeout, $mdSidenav) {
  var buildDelayedToggler = function(navID) {
    return debounce(function() {
      $mdSidenav(navID)
        .toggle();
    }, 200);
  }
  var buildToggler = function(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle();
    }
  }

  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function() {
    return $mdSidenav('right').isOpen();
  };

  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }


})
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  });
