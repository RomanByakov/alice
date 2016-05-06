angular.module('aliceApp').controller('LogsController', function($scope, $state, $stateParams, $rootScope, $cookies, Log) {
  $rootScope.checkAccess($cookies, $state, () => {
    $scope.urls = [
      `http://www.happy-giraffe.ru/`,
      `http://giraffe.code-geek.ru/`,
      'http://ntest.happy-giraffe.ru/'
    ];

    $scope.page = 1;
    $scope.order = null;
    $scope.level = null;
    $scope.tag = null;
    $scope.url = $scope.urls[0];
    $scope.apiVersion = "v1_7/"

    $scope.logs = [];

    $scope.makeRequest = () => {
      $scope.logs = Log.query({
        'per-page': 50,
        page: $scope.page,
        order: $scope.order,
        level: $scope.level,
        tag: $scope.tag,
        url: $scope.url,
        version: $scope.apiVersion
      });
    };

    $scope.makeRequest();
  });
});
