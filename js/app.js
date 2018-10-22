(function () {
    //Serves as the main controller for the application
    //Connects Directly to the Auth Controller and the API Controller  
    //Controls whether the user is logged in or not
    //Verifies the User is logged in correctly and/or needs to relogin due to timeout

    /*
    Function List:

    
    */
    var app = angular.module('SpaceJam', []);

    app.controller('AppController', function($scope,$http, Auth, API, $location) {
        console.log('in AppController');

        var script_url = "https://script.google.com/d/1H1ylIvx-vT3vNnlkTDrcphBJ1bqI2LYaBjlU1ENtygUkM_2jeuWjwnZA/edit";
        var url = script_url + "?action=read";
        $http.get(url)
            .then(function(response){
                console.log(response.data);
            }).catch(function(error){
                console.log(error);
            })



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