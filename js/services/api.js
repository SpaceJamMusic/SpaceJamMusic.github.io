(function() {
    var module = angular.module('SpaceJam');

    module.factory('API', function(Auth, $q, $http) {
        var baseUrl = 'https://api.spotify.com/v1';

        return {
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