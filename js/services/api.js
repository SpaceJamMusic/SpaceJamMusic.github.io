(function() {
    //Serves the API Controller, where the website directly makes request to the Spotify API
    //Gets the user information and the song/track information


    var module = angular.module('SpaceJam');

    module.factory('API', function(Auth, $q, $http) {
        var baseUrl = 'https://api.spotify.com/v1';

        return {
            /**
             * @description gets the current user
             * @example API.getMe()
             */
            getMe: function() {
                var ret = $q.defer();
                $http.get(baseUrl + '/me', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).then(function(r) {
                    console.log('got userinfo', r);
                    Auth.setUsername(r.data.display_name)
					ret.resolve(r);
				}, function(err) {
					console.log('failed to get userinfo', err);
					ret.reject(err);
				});
                return ret.promise;
            },
            
            /**
             * @param  {string} trackid
             * @description gets track information for a single track
             * @example API.getTrack('Track Name')
             */
            getTrack: function(trackid) {
                var ret = $q.defer();
                $http.get(baseUrl + '/tracks/' + encodeURIComponent(trackid), {
                    headers: {
                        'Authorization': 'Bearer ' + Auth.getAccessToken() 
                    }
                }).then(function(r) {
                    ret.resolve(r);
                });
                return ret.promise
            },
            /**
             * @param  {string[]} trackids
             * @description gets the information for an array of tracks
             * @example API.getTracks('Array of Track Names')
             */
            getTracks: function(trackids) {
                var ret = $q.defer();

                $http.get(baseUrl + '/tracks/?ids=' + encodeURIComponent(trackids.join(',')), {
                    headers: {
                        'Authorization': 'Bearer ' + Auth.getAccessToken() 
                    }
                }).then(function(r) {
                    ret.resolve(r);
                });
                return ret.promise;
            },
            /**
             * @description gets the current users saved tracks
             * @example API.getMyTracks()
             */
            getMyTracks: function() {
                var ret = $q.defer();
                $http.get(baseUrl + "/me/tracks", {
                    headers: {
                        'Authorization':'Bearer ' + Auth.getAccessToken()
                    }
                }).then(function(r) {
                    console.log('got user tracks', r);
                    ret.resolve(r);
                });
                return ret.promise;
            },
            /**
             * @param  {string} query
             * @description gets all tracks, artists, albums that match the search query
             * @example API.getSearchResults('search box text')
             */
            getSearchResults: function(query) {
                var ret = $q.defer();
                $http.get(baseUrl + '/search?type=track,artist,album&q=' + encodeURIComponent(query) + '&market=from_token',{
                    headers: {
                        'Authorization': 'Bearer ' + Auth.getAccessToken()
                    }
                }).then(function(r) {
                    console.log('got search results', r);
                    ret.resolve(r);
                });
                return ret.promise;
            }
        }
    })
})();