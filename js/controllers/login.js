(function() {
    var module = angular.module('SpaceJam');

    module.controller('LoginController', function($scope, Auth) {
        $scope.isLoggedIn = false;

        $scope.login = function() {
            Auth.openLogin();
        }
    });
})();