(function() {
    var module = angular.module('SpaceJam');

    module.factory('Location', function($http) {
        var url = "http://ip-api.com/json";

        return {
            getLocale: function() {
                return $http({
                    method: 'GET',
                    url: url
                }).then(function(response) {
                    //console.log(response.data);
                    return response.data;
                }).catch(function(error) {
                    console.error(error);
                })
            }
        }
    });
})();