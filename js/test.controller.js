angular.module('SpaceJam', ['spotify'])
    .config(function(SpotifyProvider) {
        SpotifyProvider.setClientId('557c763fcfc94d678e06392be801319e');
        SpotifyProvider.setRedirectUri('https://spacejammusic.github.io/callback.html');
        SpotifyProvider.setScope('playlist-read-private');
    })
    .controller('TestController', ['$scope', 'Spotify', function($scope, Spotify) {
        $scope.login = function() {
            Spotify.login().then(function(data) {
                $scope.token = data;
                alert("You are now logged in");
            }, function() {
                console.log("Did Not Log In");
            })
        }        
        
        $scope.searchArtist = function () {
            Spotify.search($scope.Artist, 'artist').then(function (data) {
                $scope.artists = data;
                console.log(data);
            }, function() {
                $scope.artists = '';
            })
        }

        $scope.searchAlbum = function() {
            Spotify.search($scope.Album, 'album').then(function(data) {
                $scope.albums = data;
                console.log(data);
            }, function() {
                $scope.albums = '';
            })
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = $scope.token;

            const player = new Spotify.player({
                name: 'Space Jam Player',
                getOAuthToken: cb => { cb(token); }
            });

            player.addListener('initialization_error', ({ message }) => { console.error(message); });
            player.addListener('authentication_error', ({ message }) => { console.error(message); });
            player.addListener('account_error', ({ message }) => { console.error(message); });
            player.addListener('playback_error', ({ message }) => { console.error(message); });

            player.addListener('player_state_changed', state => { console.log(state); });
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            plater.connect();

        }
    }])