angular.module('aliceApp').controller('NavBarController', function($rootScope, $scope, $state, $window, $cookies) {
    $rootScope.checkAccess = function($cookies, $state, callback) {
      if (!$cookies.get('user') || !$cookies.get('token')) {
        $state.go('login');
      } else {
        callback();
      }
    };

    $rootScope.init = () => {
      $rootScope.version = 'v 0.1.1';

      $scope.getVersion = () => {
        return $rootScope.version;
      };

        // User popup init
        $('.top-bar_user .teal')
          .popup({
            popup: $('.user-menu'),
            on: 'click',
            position: 'bottom left',
            movePopup:false
          });


        var $document = $(document),
            $element = $('#some-element'),
            className = 'hasScrolled';

        $rootScope.loginHideHandler = () => {
          if (($scope.user.role == undefined || $scope.user.role.name == undefined || $scope.user.role.name == 'guest') && $('.wrapper-block').hasClass('visible')) {
            //$('.wrapper-block').transition('fade right');
            $('.wrapper-block').removeClass('visible');
            $('.top-bar .top-bar_logo').removeClass('hidden');
            $('.nav-bar .nav-bar_logo').addClass('hidden');
            $('.top-bar .top-bar_search').addClass('hidden');
            $('.nav-bar .top-bar_search').removeClass('hidden');
          } else {
            $('.wrapper-block').addClass('visible');
            $('.top-bar .top-bar_logo').addClass('hidden');
            $('.nav-bar .nav-bar_logo').removeClass('hidden');
            $('.top-bar .top-bar_search').removeClass('hidden');
            $('.nav-bar .top-bar_search').addClass('hidden');
          }

          $('.hamburger').addClass('hidden');
        };

        let hideHamburger = () => {
          $('.hamburger').addClass('hidden');
        };

        $rootScope.lastWidth = $(window).width();
        $rootScope.isAdapting = false;
        let adaptive = () => {
          let width = $(window).width();
          if (width < $rootScope.lastWidth && width <= 1280 && !$rootScope.isAdapting) {
              //$('.wrapper-block').transition('fade right');
              $('.wrapper-block').removeClass('visible');
              $('.top-bar .top-bar_logo').removeClass('hidden');
              $('.nav-bar .nav-bar_logo').addClass('hidden');
              $('.top-bar .top-bar_search').addClass('hidden');
              $('.nav-bar .top-bar_search').removeClass('hidden');
              $('.hamburger').removeClass('hidden');

              $('.hamburger').click(function(){
                if($('.wrapper-block').hasClass('visible')) {
                  $('.wrapper-block').removeClass('visible');
                } else {
                  $('.wrapper-block').addClass('visible');
                }
              });

              $('.ui.sidebar.menu .item').click(function(){
                $('.wrapper-block').removeClass('visible');
              });
              $rootScope.isAdapting = true;
            } else if (width > $rootScope.lastWidth && width > 1280) {
              $('.wrapper-block').addClass('visible');
              $('.top-bar .top-bar_logo').addClass('hidden');
              $('.nav-bar .nav-bar_logo').removeClass('hidden');
              $('.top-bar .top-bar_search').removeClass('hidden');
              $('.nav-bar .top-bar_search').addClass('hidden');
              $('.hamburger').addClass('hidden');
              $rootScope.isAdapting = false;
          };

          $rootScope.lastWidth = width;
        }

        $(document).ready(function(){
          adaptive();
        });

        $(window).resize(function(){
          adaptive();
        });

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

      $rootScope.init();
      $rootScope.loginHideHandler();
    };

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

          $rootScope.init();
        };

        $scope.user = JSON.parse($cookies.get('user'));
    });

    $rootScope.loginHideHandler();
  }

  $rootScope.init();
});
