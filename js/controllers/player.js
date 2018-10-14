(function() {
    //Serves as the Player Controller
    //Logs the user out of spotify
    //Instantiates the site as spotify player

    var module = angular.module('SpaceJam');

    module.controller('PlayerController', function($scope, $rootScope, Auth, API, Playback, $location) {
        console.log('In PlayerController');

        $scope.profileUsername = Auth.getUsername();

        $rootScope.$on('login', function() {
            console.log("login");
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