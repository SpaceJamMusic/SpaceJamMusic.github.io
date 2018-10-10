(function() {
    var module = angular.module('SpaceJam');

    module.controller('PlayerController', function($scope, $rootScope, Auth, API, Playback, $location) {
        console.log('In PlayerController');
        $scope.profileUsername = Auth.getUsername();

        $rootScope.$on('login', function() {
            $scope.profileUsername = Auth.getUsername();
        })

        $scope.logout = function() {
            console.log("Logout");
            Auth.setUsername('');
            Auth.setAccessToken('', 0);
            $scope.$emit('logout');
        }
    });
})();