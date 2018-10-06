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

       
    }])