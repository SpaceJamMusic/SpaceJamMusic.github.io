(function() {
    
    var module = angular.module('SpaceJam');

    module.factory('Database', function($rootScope, API, Auth, $http) {
        //var script_url = "https://script.google.com/macros/s/AKfycbzLCiWF-6AhrPIbI47zWyzt40qfVoCRWN0kIdPsTzRfpJkbagM/exec"; //Tbl_Test_Script
        var tbl_users_script_url = "https://script.google.com/macros/s/AKfycbxwNtkqNsbaeMJEBmXvk4cuixyKvawpZbVZJKFS5Atay4VH3QU/exec"; //Tbl_Users_Script
        var tbl_users_tracks_script_url = "https://script.google.com/macros/s/AKfycby2nAGRLxCA-UEyzpQ859HUjWDdnILEP0Z-3KhUsbWf1YrGwH8/exec";
        // var url = script_url + "?action=read";

        // $http({
        //     method: "GET",
        //     url: url
        // }).then(function(response) {
        //     console.log("Database Service Data", response);
        // }).catch(function(error){
        //     console.log("Database service error", error);
        // })

        function success() {
            
        }

        return {
            checkUser: function(username) {
                var url = tbl_users_script_url + "?callback=success&username=" + username + "&points=" + '5000' + '&action=insert';
                
                return $http({
                    method: 'GET',
                    url: url
                }).then(function(response) {
                    //console.log('checkUser response', response.data);
                    return response.data; 
                }).catch(function(error) {
                    console.log(error);
                });
                
            },
            updateUserPoints: function(username, points) {
                var url = tbl_users_script_url + "?callback=success&username=" + username + "&points=" + points + "&action=update";
                console.log(url);
                return $http({
                    method: 'GET',
                    url: url
                }).then(function(response){
                    //console.log('updated points', response.data);
                    return response.data;
                }).catch(function(error){
                    console.log('error updating', error);
                })
            },
            addTrackUser: function(username, track_name, track_id, track_artist) {
                var url = tbl_users_tracks_script_url + "?callback=success&username=" + username + "&track_name=" + track_name + "&track_id=" + track_id + "&track_artist=" + track_artist + "&action=insert";
                //console.log(url);
                return $http({
                    method: 'GET',
                    url: url
                }).then(function(response){
                    console.log(response.data);
                    return response.data;
                }).catch(function(error){
                    console.log(error);
                })
            },
            readUserTbl: function() {
                var url = tbl_users_script_url + "?action=read";
                $http({
                    method: 'GET',
                    url: url
                }).then(function(response){
                    console.log(response.data.records);
                })
            }
        }
    });
})();