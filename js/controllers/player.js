(function() {
    //Serves as the Player Controller
    //Logs the user out of spotify
    //Instantiates the site as spotify player

    var module = angular.module('SpaceJam');

    module.controller('PlayerController', function($scope, $rootScope, Auth, Playback, Database) {
        console.log('In PlayerController');


        //$scope.trackInfo = [];
        $scope.profileUsername = Auth.getUsername();
        $scope.play = false;
        $scope.view = "map";
        $scope.duration = 0;
        $scope.userData;

        $scope.currentLocation = {};

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
                Database.readUserTracksTbl().then(function(response) {
                    console.log(response.records);
                    $scope.userTracks = response.records;
                });

                Database.readPostedTracks().then(function(response) {
                    console.log(response.records);
                    $scope.userPostedTracks = response.records;
                })
            } 

            console.log(view);
        }

        $scope.postedLocations = {};
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
                    Database.readPostedTracks().then(function(response) {
                       console.log(response);
                       $scope.postedTracks = response;

                       for (i = 0; i < $scope.postedTracks.length; i++) {
                            if ($scope.postedLocations.contains(Math.floor($scope.postedTracks.LATITUDE)) && $scope.postedLocations.contains(Math.floor($scope.postedTracks.LONGITUDE))) {

                            } else {
                                $scope.postedLocations.push({
                                    "lat": Math.floor($scope.postedTracks[i].LATITUDE),
                                    "lng": Math.floor($scope.postedTracks[i].LONGITUDE)
                                });
                            }
                       }

                       console.log($scope.postedLocations);

                    });
                });
                //console.log($scope.userData);
            });

            console.log($scope.currentLocation);
        })

        $scope.selectedTrack = 'Select Track';
        $scope.selectTrack = function(track) {
            $scope.selectedTrack = track;
        }
        $scope.reset = function() {
            $scope.selectedTrack = 'Select Track';
        }

        $scope.postTrack = function() {
            var username = $scope.userData.USERNAME
            var lat = $scope.currentLocation.lat;
            var lng = $scope.currentLocation.lng;
            var track_name = $scope.selectedTrack;
            var tracksArray = $scope.userTracks;
            console.log(tracksArray);
            for (i = 0; i < tracksArray.length; i++) {

                if (tracksArray[i].TRACK_NAME == track_name) {
                    var track_id = tracksArray[i].TRACK_ID;
                }
            }
            

            Database.postTrack(username, lat , lng, track_name, track_id);
            $rootScope.$emit('changed');
        }

        $scope.buyTrack = function(track_name, track_uid, track_artist, track_cost) {
            //console.log(track_name, track_uid);
            console.log(track_cost * 40);
            var cost = track_cost * 40;
            $scope.profileUsername = Auth.getUsername(); 

            Database.addTrackUser($scope.profileUsername, track_name, track_uid, track_artist).then(function(response) {           
                if (response.data.result == "exists") {
                } else if (response.data.result == "Inserted") {
                    Database.updateUserPoints($scope.profileUsername, cost).then(function(response) {
                        if (response.result == 'success') {
                            console.log(response.points);
                            $scope.userData.POINTS = response.points;
                            Database.readUserTracksTbl().then(function(response) {
                                console.log(response.records);
                                $scope.userTracks = response.records;
                            });
                        } else if (response.result == 'failure') {
                            Database.deleteUserTrack($scope.profileUsername,track_uid).then(function(response){
                                console.log("not enough points to get song");
                            });
                        }
                    });
                }
            });

            $rootScope.$emit('changed');
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


        $scope.upVote = function(track_name, track_uid, track_artist) {
            Database.addTrackUser($scope.profileUsername, track_name, track_uid, track_artist);
            Database.updateUserPoints($scope.profileUsername, -500).then(function(response){
                $scope.userData.POINTS = response.points;
            })
            //$rootScope.$emit('changed');

        }

        // $rootScope.$on('changed', function() {

        // })
    });
})();

