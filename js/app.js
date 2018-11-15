(function () {
    //Serves as the main controller for the application
    //Connects Directly to the Auth Controller and the API Controller  
    //Controls whether the user is logged in or not
    //Verifies the User is logged in correctly and/or needs to relogin due to timeout

    /*
    Function List:

    
    */
    var app = angular.module('SpaceJam', []);

    app.controller('AppController', function($scope,$http, Auth, API, $location, Database, Location) {
        console.log('in AppController');
       
        /**
         * @param  {boolean} redirectToLogin
         */
        function checkUser(redirectToLogin) {
            API.getMe().then(function(userInfo) {
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

        Location.requestLocale().then(function(response) {
            Location.setLocale(response.lon, response.lat);
            $scope.location = Location.getLocale();
            console.log($scope.location);
        });
        $scope.isLoggedIn = (Auth.getAccessToken() != '');
        $scope.showPlayer = $scope.isLoggedIn;
        $scope.showLogin = !$scope.isLoggedIn;        
        
        
        $scope.$on('login', function() {
            $scope.showPlayer = true;
            
            $scope.showLogin = false;
        })

        $scope.$on('logout', function() {
            $scope.showPlayer = false;
            $scope.showLogin = true;
        })


        checkUser();
    })
})();