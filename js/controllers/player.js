(function() {
    //Serves as the Player Controller
    //Logs the user out of spotify
    //Instantiates the site as spotify player

    var module = angular.module('SpaceJam');

    module.controller('PlayerController', function($scope, $rootScope, Auth, API, Playback, PlayQueue, $location, $http, Database) {
        console.log('In PlayerController');


        //$scope.trackInfo = [];
        $scope.profileUsername = Auth.getUsername();
        $scope.play = false;
        $scope.mapview = true;
        $scope.duration = 0;

        $scope.resume = function() {
            Playback.resume();
            $scope.play = true;
        }
 
        $scope.pause = function() {
            Playback.pause();
            $scope.play = false;
        }                                                

        $scope.changeview = function(view) {
            if (view == 'map' && $scope.mapview == true) {

            } else if (view == 'search' && $scope.mapview == false) {

            } else {
                $scope.mapview = !$scope.mapview;
            }
            
        }

        
        //7ckZ58Uo6I6nTrMs1SeimI
        $rootScope.$on('login', function() {
            console.log("login");
            $scope.profileUsername = Auth.getUsername(); 
            //Database.readUserTbl();
            Database.checkUser($scope.profileUsername);
        })

        $rootScope.$on('login-done', function(){
            console.log(Database.getUserData());
        })

        $rootScope.$on('playerchanged', function() {
            $scope.trackInfo = Playback.getTrackData();
            //console.log($scope.trackInfo);
            $scope.play = true;
        })

        $rootScope.$on('trackprogress', function() {
            $scope.progress = Playback.getProgress();
            $scope.duration = Playback.getDuration();
        })

        $scope.logout = function() {
            console.log("Logout");
            Auth.setUsername('');
            Auth.setAccessToken('', 0);
            $scope.$emit('logout');
        }
    });
})();