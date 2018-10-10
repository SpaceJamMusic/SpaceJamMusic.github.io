(function() {
    var module = angular.module('SpaceJam');

    module.factory('API', function(Auth, $q, $http) {
        var baseUrl = 'https://api.spotify.com/v1';

        return {
            getMe: function() {
                var ret = $q.defer();
                $http.get(baseUrl + '/me', {
					headers: {
						'Authorization': 'Bearer ' + Auth.getAccessToken()
					}
				}).then(function(r) {
                    console.log('got userinfo', r);
					ret.resolve(r);
				}, function(err) {
					console.log('failed to get userinfo', err);
					ret.reject(err);
				});
                return ret.promise;
            },
            
            getTrack: function(trackid) {
                var ret = $q.defer();

                $http.get(baseUrl + '/tracks' + encodeURIComponent(trackid), {
                    headers: {
                        'Authorization': 'Bearer ' + Auth.getAccessToken() 
                    }
                }).success(function(r) {
                    ret.resolve(r);
                });
                return ret.promise
            },

            getTracks: function(trackids) {
                var ret = $q.defer();

                $http.get(baseUrl + '/tracks/?ids=' + encodeURIComponent(trackids.join(',')), {
                    headers: {
                        'Authorization': 'Bearer ' + Auth.getAccessToken() 
                    }
                }).success(function(r) {
                    ret.resolve(r);
                });
                return ret.promise;
            }
        }
    })
})();