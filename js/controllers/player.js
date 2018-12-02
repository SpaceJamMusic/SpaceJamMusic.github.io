(function() {
    //Serves as the Player Controller
    //Logs the user out of spotify
    //Instantiates the site as spotify player

    var module = angular.module('SpaceJam');

    module.controller('PlayerController', function($scope, $rootScope, Auth, Playback, Database, PlayQueue, Location) {
        console.log('In PlayerController');


        //$scope.trackInfo = [];
        $scope.profileUsername = Auth.getUsername();
        $scope.playing = false;
        $scope.duration = 0;
        $scope.userData;

        $scope.tracksNearLocation = {};

        $scope.currentLocation = {};
        
        /**
         * @description resumes currently playing track
         * @example resume()
         */
        $scope.resume = function() {
            Playback.resume();
            $scope.playing = true;
        }
 
        /**
         * @description pauses currently playing track
         * @example pause()
         */
        $scope.pause = function() {
            Playback.pause();
            $scope.playing = false;
        }                                    

        $scope.postedLocations = [];
        //7ckZ58Uo6I6nTrMs1SeimI

        /**
         * @description on user login, checks user in database, if exists returns points, if does not exits adds user to database
         */
        $rootScope.on('login', function() {
            console.log("login");
            $scope.profileUsername = Auth.getUsername(); 
            //Database.readUserTbl();
            Database.checkUser($scope.profileUsername).then(function(response) {
                console.log("current user info", response);
                $scope.userData = response[0];
                Database.readUserTracksTbl().then(function(response) {
                    console.log(response.records);
                    $scope.userTracks = response.records;
                    $scope.getPostedTracks();

                });
                //console.log($scope.userData);
            });

            console.log($scope.currentLocation);
        })

        /**
         * @description gets all of the posted tracks in the database
         * @example getPostedTracks()
         */
        $scope.getPostedTracks = function() {
            Database.readPostedTracks().then(function(response) {
                $scope.postedTracks = response;
                console.log('Got Posted Tracks', $scope.postedTracks);
                initMap("distance", $scope.currentLocation.lat, $scope.currentLocation.lng, $scope.postedTracks);
                
            });
        }

        $scope.selectedTrack = 'Select Track';
        /**
         * @param  {} track
         * @description gets the selected track
         * @example selectTrack('TrackName')
         */
        $scope.selectTrack = function(track) {
            $scope.selectedTrack = track;
        }
        $scope.reset = function() {
            $scope.selectedTrack = 'Select Track';
        }

        $scope.play = function(trackuri) {
            console.log("play:", trackuri)
            PlayQueue.play(trackid);
            $scope.play = true;
        }

        /**
         * @description takes the users current location and selected song, then adds the song to the location database
         * @example postTrack()
         */
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
                    var track_uri = tracksArray[i].TRACK_URI
                }
            }
            

            Database.postTrack(username, lat , lng, track_name, track_id, track_uri);
            $rootScope.$emit('changed');
            $scope.getPostedTracks();
        }

        /**
         * @description checks the current users point level to make sure they can buy the track, if they can adds song to database, if they dont doesnt allow user to buy
         * @example buyTrack('track_name', 'track_id', 'track_artist', 'track_cost', 'track_uri')
         * @param  {} track_name
         * @param  {} track_uid
         * @param  {} track_artist
         * @param  {} track_cost
         * @param  {} track_uri
         */
        $scope.buyTrack = function(track_name, track_uid, track_artist, track_cost, track_uri) {
            //console.log(track_name, track_uid);
            console.log(track_cost * 40);
            var cost = track_cost * 40;
            $scope.profileUsername = Auth.getUsername(); 

            Database.addTrackUser($scope.profileUsername, track_name, track_uid, track_artist, track_uri).then(function(response) {           
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

        /**
         * @description adds tracks that are near location to the play queue
         * @example addTracksToQueue()
         */
        $scope.addTracksToQueue = function() {
            //console.log($scope.tracksNearLocation);
            for (i = 0; i < $scope.tracksNearLocation.length; i++) {
                //console.log($scope.tracksNearLocation[i].TRACK_URI)
                PlayQueue.enqueue($scope.tracksNearLocation[i].TRACK_URI);
            }
            $scope.trackQueue = PlayQueue.getQueue();
            PlayQueue.playFrom(0);
            console.log("Track queue", PlayQueue.getQueue());
        }

        $scope.clearQueue = function() {
            PlayQueue.clear();
        }

        $scope.next = function() {
            PlayQueue.next();
            Playback.startPlaying(PlayQueue.getCurrent());
        }

        $rootScope.$on('login-done', function(){
            console.log(Database.getUserData());
        })

        $rootScope.$on('playerchanged', function() {
            $scope.currentTrack = Playback.getTrack();
            $scope.playing = Playback.isPlaying();
            $scope.trackData = Playback.getTrackData();
            for (i = 0; i < $scope.tracksNearLocation.length; i++) {
                if ($scope.tracksNearLocation[i].TRACK_URI == $scope.trackData.data.uri) {
                    $scope.poster = $scope.tracksNearLocation[i].USERNAME;
                }
            }
            console.log('posted by:', $scope.poster);
            console.log("TrackData:", $scope.trackData);
        })

        $rootScope.$on('endtrack', function() {
            console.log('PlayerController: endtrack');
            $scope.currentTrack = Playback.getTrack();
            $scope.trackData = Playback.getTrackData();
            $scope.playing = Playback.isPlaying();
            PlayQueue.next();
            Playback.startPlaying(PlayQueue.getCurrent());
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


        $scope.upVote = function() {
            var tracksNearLocation = $scope.tracksNearLocation;
            //var currentLocation = $scope.currentLocation;
            
            var trackData = $scope.trackData;
            Database.addTrackUser($scope.profileUsername, trackData.data.name, trackData.data.id, trackData.data.artists[0].name, trackData.data.uri);
            for (i = 0; i < tracksNearLocation.length; i++) {
                if (tracksNearLocation[i].TRACK_URI == trackData.data.uri) {
                    $scope.poster = tracksNearLocation[i].USERNAME;
                }
            }
            Database.updateUserPoints($scope.poster, -500).then(function(response){
                $scope.userData.POINTS = response.points;
            })
        }

        function isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }

    });
})();

