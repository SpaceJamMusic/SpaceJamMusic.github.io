(function() {
    var module = angular.module('SpaceJam');

    module.controller("SearchController", function($scope, API, PlayQueue) {
        $scope.query = '';
        $scope.albums = [];
        $scope.tracks = [];
        $scope.artists = [];
        console.log('In SearchController');

        $scope.search = function() {
            //console.log('search for', $scope.query);
            API.getSearchResults($scope.query).then(function(results) {
                //console.log('search results', results);
                $scope.artists = results.data.artists;
                $scope.albums = results.data.albums;
                $scope.tracks = results.data.tracks
                console.log('got search results for tracks', $scope.tracks)

            })
        }

        $scope.play = function(trackuri) {
            PlayQueue.play(trackuri);
            $scope.play = false;
        }
    });
})();