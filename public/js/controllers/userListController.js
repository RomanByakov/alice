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

            $('.message .close')
            .on('click', function() {
              $(this)
                .closest('.message')
                .transition('scale')
              ;
            })
          ;
          // attach events to buttons


        });

        // // $('.user-delete-modal.modal')
        // //   .modal('attach events', '.user-delete-modal_show')
        // // ;
        //
        // $('.user-delete-modal_show').click(function(){
        //   $('.user-delete-modal.modal').modal('show');
        // });
    })
