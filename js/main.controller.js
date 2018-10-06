angular.module('SpaceJam', ['spotify'])
    .config(function(SpotifyProvider) {
        SpotifyProvider.setClientId('557c763fcfc94d678e06392be801319e');
        SpotifyProvider.setRedirectUri('https://spacejammusic.github.io/callback.html');
        SpotifyProvider.setScope('playlist-read-private');
    })
    .controller('MainController', ['$scope', 'Spotify', function($scope, Spotify) {

        $scope.isLoggedIn = false;
        
        $scope.login = function() {
            Spotify.login().then(function(data) {
                $scope.isLoggedIn = true;
            }, function() {
                console.log("Did Not Log In");
            })
        }     
    }])