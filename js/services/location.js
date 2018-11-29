(function() {
    var module = angular.module('SpaceJam');

    module.factory('Location', function($http) {
        var base_url = "https://maps.googleapis.com/maps/api/distancematrix/json";
        var key = "&key=AIzaSyDU2FyHaBYcS7Hwywd5ky7QDOV2btqcTD8";

        function callback() {

        }

        return {
            getDistance: function(user_lat, user_lng, track_lat, track_lng) {
                var url = base_url + "?origins=" + track_lat + "," + track_lng + "&destinations=" + user_lat + "," + user_lng + key + "&callback=callback";
                console.log(url);
                
                $http.jsonp(url).then(function(response) {
                    console.log(response);
                })
            }
        }
    });
})();