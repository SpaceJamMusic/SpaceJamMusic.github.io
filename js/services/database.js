(function() {
    
    var module = angular.module('SpaceJam');

    module.factory('Database', function($rootScope, API, Auth, $http) {
        //var script_url = "https://script.google.com/macros/s/AKfycbzLCiWF-6AhrPIbI47zWyzt40qfVoCRWN0kIdPsTzRfpJkbagM/exec"; //Tbl_Test_Script
        var tbl_users_script_url = "https://script.google.com/macros/s/AKfycbxwNtkqNsbaeMJEBmXvk4cuixyKvawpZbVZJKFS5Atay4VH3QU/exec"; //Tbl_Users_Script
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
            readUserTbl();
        }

        return {
            checkUser: function(username) {
                var url = tbl_users_script_url + "?callback=success&username=" + username + "&points=" + '5000' + '&action=insert';

                $http({
                    method: 'GET',
                    url: url
                }).then(function(response) {
<<<<<<< HEAD
                    console.log('checkUser response', response.data);
=======
                    console.log(response.data);
                    
>>>>>>> 8237b7eb06433d70a5e2211de02dceefa64af8ba
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
            }
        }
    });
})();