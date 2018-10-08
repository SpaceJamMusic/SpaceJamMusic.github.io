(function () {
    var app = angular.module('SpaceJam', []);

    app.controller('AppController', function($scope, Auth, API, $location) {

        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
                checkUser(true);
            }
        }, false);

        $scope.isLoggedIn = (Auth.getAccessToken() != '');
        

    })
})();