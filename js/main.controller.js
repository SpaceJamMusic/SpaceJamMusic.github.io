angular.module('SpaceJam', ['spotify'])
    .config(function(SpotifyProvider) {
        SpotifyProvider.setClientId('557c763fcfc94d678e06392be801319e');
        SpotifyProvider.setRedirectUri('https://spacejammusic.github.io/callback.html');
        SpotifyProvider.setScope('playlist-read-private');
    })
    .controller('MainController', ['$scope', 'Spotify', function($scope, Spotify) {
        $scope.login = function() {
            Spotify.login().then(function(data) {
                console.log(data);
                alert("You are now logged in");
            }, function() {
                console.log("Did Not Log In");
            })
        }        
        
        $scope.searchArtist = function () {
            Spotify.search($scope.SearchArtist, 'artist').then(function (data) {
                $scope.artists = data.artists.items;
            })
        }
    }])