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
        $scope.view = "map";
        $scope.duration = 0;
        $scope.userData;

        $scope.resume = function() {
            Playback.resume();
            $scope.play = true;
        }
 
        $scope.pause = function() {
            Playback.pause();
            $scope.play = false;
        }                                                

        $scope.changeview = function(view) {
            if (view == 'map' && $scope.view == 'map') {
            } else if (view == 'search' && $scope.view == 'search') {
            } else if (view == 'profile' && $scope.view == 'profile') {
            } else {
                $scope.view = view
            }

            if (view == 'profile') {
                $scope.$emit('profile');
            } 

            console.log(view);
        }

        $rootScope.$emit('profile', function() {
            Database.readUserTracksTbl().then(function(response) {
                console.log(response.records);
                $scope.userTracks = response.records;
            });
        });
        
        //7ckZ58Uo6I6nTrMs1SeimI
        $rootScope.$on('login', function() {
            console.log("login");
            $scope.profileUsername = Auth.getUsername(); 
            //Database.readUserTbl();
            Database.checkUser($scope.profileUsername).then(function(response) {
                console.log("current user info", response);
                $scope.userData = response[0];
                Database.readUserTracksTbl().then(function(response) {
                    console.log(response.records);
                    $scope.userTracks = response.records;
                });
                //console.log($scope.userData);
            });
        })

        $scope.buyTrack = function(track_name, track_uid, track_artist, track_cost) {
            //console.log(track_name, track_uid);
            console.log(track_cost * 20);
            var cost = track_cost * 20;
            $scope.profileUsername = Auth.getUsername(); 

            Database.updateUserPoints($scope.profileUsername, cost).then(function(response){
                console.log(response);
                if (response.result == 'success') {
                    Database.addTrackUser($scope.profileUsername, track_name, track_uid, track_artist).then(function(response) {
                        console.log(response);
                    });
                } else {
                    return;
                }
            });
        }

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