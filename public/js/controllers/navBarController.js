angular.module('aliceApp').controller('NavBarController', function($rootScope, $scope, $state, $window, $cookies) {
    $rootScope.checkAccess = function($cookies, $state, callback) {
      if (!$cookies.get('user') || !$cookies.get('token')) {
        $state.go('login');
      } else {
        callback();
      }
    };

    $rootScope.init = () => {
        $('.top-bar_user .teal').popup({
          popup: $('.user-menu'),
          on: 'click',
          position: 'bottom left'
        });


        var $document = $(document),
            $element = $('#some-element'),
            className = 'hasScrolled';

        function adaptive() {
          var width = $(window).width(), height = $(window).height();
          if (width <= 1023) {
            if($('.wrapper-block').hasClass('visible')) {
              $('.wrapper-block').transition('fade right');
              $('.wrapper-block').removeClass('visible');
              $('.top-bar .top-bar_logo').removeClass('hidden');
              $('.nav-bar .nav-bar_logo').addClass('hidden');
              $('.top-bar .top-bar_search').addClass('hidden');
              $('.nav-bar .top-bar_search').removeClass('hidden');
              $('.hamburger').removeClass('hidden');
            }
          } else {
            $('.wrapper-block').addClass('visible');
            $('.top-bar .top-bar_logo').addClass('hidden');
            $('.nav-bar .nav-bar_logo').removeClass('hidden');
            $('.top-bar .top-bar_search').removeClass('hidden');
            $('.nav-bar .top-bar_search').addClass('hidden');
            $('.hamburger').addClass('hidden');
          }
        };

        $(document).ready(function(){
          adaptive();
        });

        $(window).resize(function(){
          adaptive();
        });


        $('.hamburger').click(function(){
          if($('.wrapper-block').hasClass('visible'))
          {
            $('.wrapper-block').removeClass('visible');
          }
          else {
            $('.wrapper-block').addClass('visible');
          }

        });
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

    $scope.user = {
      showTooltip: false,
      tipDirection: ''
    };

    $rootScope.update = function() {
      if ($cookies.get('user')) {
        $scope.user = JSON.parse($cookies.get('user'));
      } else {
        $state.go('login');
      }
    }

    $rootScope.init();

    $rootScope.checkAccess($cookies, $state, () => {
        $scope.logout = () => {
          $cookies.remove('token');
          $cookies.remove('user');

          $scope.user.role = {
              name: 'guest'
          };
          $state.go('users', {}, {
              reload: true
          });
        };

        $scope.user = JSON.parse($cookies.get('user'));
    });
});
