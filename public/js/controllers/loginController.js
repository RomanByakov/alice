angular.module('aliceApp').controller('LoginController', function($scope, $state, $stateParams, $cookies, Login, User) {
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
