angular.module('SpaceJam', ['spotify'])
    .config(function(SpotifyProvider) {
        SpotifyProvider.setClientId('557c763fcfc94d678e06392be801319e');
        SpotifyProvider.setRedirectUri('https://spacejammusic.github.io/callback.html');
        SpotifyProvider.setScope('playlist-read-private');
    })
    .controller('MainController', ['$scope', 'Spotify', function($scope, Spotify) {

        $scope.isLoggedIn = false;
        $scope.token = '';
        
        $scope.login = function() {
            Spotify.login().then(function(data) {
                window.onSpotifyWebPlaybackSDKReady = () => {
                    //const token = angular.element(document.querySelector('[ng-controller="MainController"]')).scope().token;
                    const token = data;

                    const player = new Spotify.Player({
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
        
                    player.connect();
        
                }
                $scope.isLoggedIn = true;
            }, function() {
                console.log("Did Not Log In");
            })
            //toggleSidebar();
        }

    }])