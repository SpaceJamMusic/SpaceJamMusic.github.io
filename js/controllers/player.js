(function () {

    var module = angular.module('SpaceJam');

    module.controller('PlayerController', function ($scope, $rootScope, Auth, Playback, Database, PlayQueue) {


        $scope.profileUsername = Auth.getUsername();
        console.log('In PlayerController: ', $scope.profileUsername);
        $scope.playing = false;
        $scope.userData;

        $scope.tracksNearLocation = {};
        $scope.currentLocation = {};
        $scope.postedLocations = {};

        $scope.resume = function () {
            Playback.resume();
            $scope.playing = true;
        }

        $scope.pause = function () {
            Playback.pause();
            $scope.playing = false;
        }

        $scope.logout = function () {
            console.log("Logout");
            PlayQueue.clear();
            Auth.setUsername('');
            Auth.setAccessToken('', 0);
            $scope.$emit('logout');
        }

        $rootScope.$on('login', function () {
            $scope.profileUsername = Auth.getUsername();

            Database.checkUser($scope.profileUsername).then(function (response) {
                console.log("PlayerController: Current User Info", response);
                $scope.userData = response[0];
                Database.readUserTracksTbl().then(function (response) {
                    console.log('PlayerController: UserTracks', response.records);
                    $scope.userTracks = response.records;
                    $scope.getPostedTracks();

                })
            })
        })

        $rootScope.$on('playerchanged', function () {
            $scope.currentTrack = Playback.getTrack();
            $scope.playing = Playback.isPlaying();
            $scope.trackData = Playback.getTrackData();
            for (i = 0; i < $scope.tracksNearLocation.length; i++) {
                if ($scope.tracksNearLocation[i].TRACK_URI == $scope.trackData.data.uri) {
                    $scope.poster = $scope.tracksNearLocation[i].USERNAME;
                }
            }
            console.log('PlayerController: poster', $scope.poster);
            console.log('PlayerController: TrackData', $scope.trackData);
        })

        $rootScope.$on('endtrack', function () {
            console.log('PlayerController: endtrack');
            //PlayQueue.dequeue();
            $scope.currentTrack = Playback.getTrack();
            $scope.trackData = Playback.getTrackData();
            $scope.playing = Playback.isPlaying();
            PlayQueue.next();
            Playback.startPlaying(PlayQueue.getCurrent());
        })

        $scope.getPostedTracks = function () {
            Database.readPostedTracks().then(function (response) {
                $scope.postedTracks = response;
                console.log('PlayerController: Got Posted Tracks', $scope.postedTracks);
                initMap("distance", $scope.currentLocation.lat, $scope.currentLocation.lng, $scope.postedTracks);
            });
        }

        $scope.selectedTrack = 'Select Track';

        $scope.selectTrack = function (track) {
            $scope.selectedTrack = track;
        }
        $scope.reset = function () {
            $scope.selectedTrack = 'Select Track';
        }

        $scope.play = function (trackuri) {
            console.log("play:", trackuri)
            PlayQueue.play(trackid);
            $scope.play = true;
        }

        $scope.postTrack = function () {
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


            Database.postTrack(username, lat, lng, track_name, track_id, track_uri);
            showSuccessToast('Successfully posted ' + track_name + ' to the location');
            $rootScope.$emit('changed');
            $scope.getPostedTracks();
        }

        $scope.buyTrack = function (track_name, track_uid, track_artist, track_cost, track_uri) {
            //console.log(track_name, track_uid);
            console.log(track_cost * 40);
            var cost = track_cost * 40;
            $scope.profileUsername = Auth.getUsername();

            Database.addTrackUser($scope.profileUsername, track_name, track_uid, track_artist, track_uri).then(function (response) {
                if (response.data.result == "exists") {
                    showErrorToast('Failed to buy track, already in collection');
                } else if (response.data.result == "Inserted") {
                    Database.updateUserPoints($scope.profileUsername, cost).then(function (response) {
                        if (response.result == 'success') {
                            console.log(response.points);
                            $scope.userData.POINTS = response.points;
                            Database.readUserTracksTbl().then(function (response) {
                                console.log(response.records);
                                $scope.userTracks = response.records;
                            });
                            showSuccessToast('Successfully bought ' + track_name + ' by ' + track_artist + ' for ' + cost);
                        } else if (response.result == 'failure') {
                            Database.deleteUserTrack($scope.profileUsername, track_uid).then(function (response) {
                                console.log("not enough points to get song");
                            });
                            showErrorToast('Failed to buy Track, not enough points');
                        }
                    });
                }
            });

            $rootScope.$emit('changed');
        }

        $scope.addTracksToQueue = function () {
            console.log($scope.tracksNearLocation);
            for (i = 0; i < $scope.tracksNearLocation.length; i++) {
                //console.log($scope.tracksNearLocation[i].TRACK_URI)
                PlayQueue.enqueue($scope.tracksNearLocation[i].TRACK_URI);
            }
            $scope.trackQueue = PlayQueue.getQueue();
            PlayQueue.playFrom(0);
            console.log("Track queue", PlayQueue.getQueue());
        }

        $scope.clearQueue = function () {
            PlayQueue.clear();
        }

        $scope.next = function () {
            showSuccessToast('Downvoted track, skipping to next in queue');
            PlayQueue.next();
            Playback.startPlaying(PlayQueue.getCurrent());
        }

        $scope.upVote = function () {
            var tracksNearLocation = $scope.tracksNearLocation;
            //var currentLocation = $scope.currentLocation;

            console.log($scope.poster);
            var trackData = $scope.trackData;
            Database.addTrackUser($scope.profileUsername, trackData.data.name, trackData.data.id, trackData.data.artists[0].name, trackData.data.uri);

            Database.updateUserPoints($scope.poster, -500).then(function (response) {
                $scope.userData.POINTS = response.points;
            })
            showSuccessToast('Upvoted Track, added track to your collection');

        }
    });
})();