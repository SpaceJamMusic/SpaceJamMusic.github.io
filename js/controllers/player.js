(function() {
    //Serves as the Player Controller
    //Logs the user out of spotify
    //Instantiates the site as spotify player

    var module = angular.module('SpaceJam');

    module.controller('PlayerController', function($scope, $rootScope, Auth, API, Playback, PlayQueue, $location) {
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
            // API.getTrack("7ckZ58Uo6I6nTrMs1SeimI").then(function(list) {
            //     console.log('got track', list);
            //     $scope.trackInfo = list.data;
            // })
            // API.getMyTracks().then(function(list) {
            //     console.log('Got user tracks', list);
            //     $scope.trackInfo = list.data;
            // })
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