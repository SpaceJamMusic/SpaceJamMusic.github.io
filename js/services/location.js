(function() {
    var module = angular.module('SpaceJam');

    module.factory('Location', function($http) {
        var url = "http://ip-api.com/json";

        return {
            requestLocale: function() {
                return $http({
                    method: 'GET',
                    url: url
                }).then(function(response) {
                    //console.log(response.data);
                    return response.data;
                }).catch(function(error) {
                    console.error(error);
                })
            },
            setLocale: function(lon, lat) {
                localStorage.setItem('lon', String(lon));
                localStorage.setItem('lat', String(lat));
            },
            getLocale: function() {
                var lon = localStorage.getItem('lon', '');
                var lat = localStorage.getItem('lat', '');

                var location = {
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                };

                return location;
            }

        }
    });
})();