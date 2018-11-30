(function() {
    
    var module = angular.module('SpaceJam');

    module.factory('Database', function($rootScope, API, Auth, $http) {
        //var script_url = "https://script.google.com/macros/s/AKfycbzLCiWF-6AhrPIbI47zWyzt40qfVoCRWN0kIdPsTzRfpJkbagM/exec"; //Tbl_Test_Script
        var tbl_users_script_url = "https://script.google.com/macros/s/AKfycbxwNtkqNsbaeMJEBmXvk4cuixyKvawpZbVZJKFS5Atay4VH3QU/exec"; //Tbl_Users_Script
        var tbl_users_tracks_script_url = "https://script.google.com/macros/s/AKfycby2nAGRLxCA-UEyzpQ859HUjWDdnILEP0Z-3KhUsbWf1YrGwH8/exec";
        var tbl_location_tracks_script_url = "https://script.google.com/macros/s/AKfycbwSU3YHc_n9Myywc2zotBMcDvwunW_CXzFJYLmu7C4-UHSSYxT8/exec";
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
            addTrackUser: function(username, track_name, track_id, track_artist, track_uri) {
                console.log(track_uri)
                var url = tbl_users_tracks_script_url + "?callback=success&username=" + username + "&track_name=" + track_name + "&track_id=" + track_id + "&track_artist=" + track_artist + "&track_uri=" + track_uri + "&action=insert";
                console.log(url);
                return $http({
                    method: 'GET',
                    url: url
                }).then(function(response){
                    //console.log(response.data);
                    return response;
                }).catch(function(error){
                    console.log(error);
                })
            },
            deleteUserTrack: function(username, track_id) {
                var url = tbl_users_tracks_script_url + "?callback=success&username=" + username + "&track_id=" + track_id + "&action=delete";

                return $http({
                    method: 'GET',
                    url: url
                }).then(function(result){
                    return response.data;
                }).catch(function(error){
                    console.log(error);
                }) 
            },
            readUserTracksTbl: function() {
                var url = tbl_users_tracks_script_url + "?action=read";

                return $http({
                    method: "GET",
                    url: url
                }).then(function(response) {
                    //console.log(response.data);
                    return response.data;
                }).catch(function(error) {
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
            },
            postTrack: function(username, lat, lng, track_name, track_id, track_uri) {
                console.log(track_name);
                var url = tbl_location_tracks_script_url +  "?callback=sucess&username=" + username + "&lat=" + lat + "&lng=" + lng + "&track_name=" + track_name + "&track_id=" + track_id + "&track_uri=" + track_uri + "&action=insert"; 
                //console.log(url);
                $http({
                    method: 'GET',
                    url: url
                }).then(function(response){
                    console.log(response);
                }).catch(function(error){
                    console.error(error);
                })
            },
            readPostedTracks: function() {
                var url = tbl_location_tracks_script_url + "?action=read";

                return $http({
                    method: 'GET',
                    url: url
                }).then(function(response){
                    return response.data.records;
                }).catch(function(error){
                    console.error(error);
                })
            }
        }
    });
})();