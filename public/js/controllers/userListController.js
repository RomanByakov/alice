angular.module('aliceApp')
    // users controllers
    .controller('UserListController', function($rootScope, $scope, $state, $window, User, $cookies) {
        $rootScope.checkAccess($cookies, $state, function() {
            $rootScope.update();

            $scope.users = User.query();

            $scope.currentUser = JSON.parse($cookies.get('user'));

            $( "#search" ).focus();

            $scope.deleteUser = function(user) {
                user.$delete().then(function() {
                  $('.user-delete-modal.modal').modal('hide');
                    $state.go('users', {}, {
                        reload: true
                    });
                });
            };

            $scope.showPopup = function(user) {
              $scope.userForDelete = user;
                $('.user-delete-modal.modal').modal('show');
            };

            // attach events to buttons

            $('.message .close')
            .on('click', function() {
              $(this)
                .closest('.message')
                .transition('scale')
              ;
            })
          ;

          var userCardsMessage = function(){
            $('.user-cards_message').transition({
              animation : 'scale in',
              duration : '1s'
            });
          }

          setTimeout(userCardsMessage, 1500);

          $scope.testCards = function() {
            //alert('scope on rendered');
            $('.user-cards .card').transition({
              animation : 'scale',
              reverse   : 'auto', // default setting
              interval  : 200
            });
          };

        });





        // // $('.user-delete-modal.modal')
        // //   .modal('attach events', '.user-delete-modal_show')
        // // ;
        //
        // $('.user-delete-modal_show').click(function(){
        //   $('.user-delete-modal.modal').modal('show');
        // });
    })
    .directive('userRepeatDirective', function() {
      return function (scope, element, attrs) {
        if (scope.$last) {
          $('.user-cards .card').transition({
            animation : 'scale in',
            reverse   : 'auto', // default setting
            interval  : 300,
            duration : '0.5s'
          });
        }
      };
    });
