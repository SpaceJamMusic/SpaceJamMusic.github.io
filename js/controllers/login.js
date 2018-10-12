(function() {
    //serves as the Login Controller
    //connects to the front end of the application and then starts the login process
    //
    
    var module = angular.module('SpaceJam');

    module.controller('LoginController', function($scope, Auth) {
        $scope.isLoggedIn = false;

        $scope.login = function() {
            Auth.openLogin();
        }
    });
})();