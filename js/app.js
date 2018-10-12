(function () {
    var app = angular.module('SpaceJam', []);

    app.controller('AppController', function($scope, Auth, API, $location) {
        console.log('in AppController');

        function checkUser(redirectToLogin) {
            API.getMe().then(function(userInfo) {
                Auth.setUsername(userInfo.display_name);
                if(redirectToLogin) {
                    $scope.$emit('login');
                }
            }, function(err) {
                $scope.showPlayer = false;
                $scope.showLogin = true;
            });
        }

        window.addEventListener("message", function(event) {
            console.log('got postmessage', event);
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                Auth.setAccessToken(hash.access_token, hash.expires_in || 60);
                checkUser(true);
            }
        }, false);

        $scope.isLoggedIn = (Auth.getAccessToken() != '');
        $scope.showPlayer = $scope.isLoggedIn;
        $scope.showLogin = !$scope.isLoggedIn;        
        
        
        $scope.$on('login', function() {
            $scope.showPlayer = true;
            $scope.showLogin = false;
            $scope.user = Auth.getUsername();
        })

        $scope.$on('logout', function() {
            $scope.showPlayer = false;
            $scope.showLogin = true;
        })


        checkUser();
    })
})();