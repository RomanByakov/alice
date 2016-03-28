/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('aliceApp.services',[]).factory('User',function($resource){
    return $resource('users/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        },
        save: {
          method: 'POST'
        }
    });
}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});
