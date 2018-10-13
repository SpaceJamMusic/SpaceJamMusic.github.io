(function() {
    //Serves as the Login and User authetication Controller
    //Opens up the login page for Spotify and allows the user to either create a spotify account or loginto existing account
    //Sets and Gets the username and acesstoken for the application 

    var module = angular.module('SpaceJam');

    module.factory('Auth', function() {
        var CLIENT_ID = '';
        var REDIRECT_URI = '';

        if (location.host == 'localhost:8000') {
            CLIENT_ID = 'f9258774c64747c089bd429bc119c35e';
            REDIRECT_URI = 'http://localhost:8000/callback.html';
        } else {
            CLIENT_ID = '557c763fcfc94d678e06392be801319e';
            REDIRECT_URI = 'https://spacejammusic.github.io/callback.html';
        }

        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID
                + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
                + '&scope=' + encodeURIComponent(scopes.join(' '))
                + '&response_type=token';
        }

        return {
            openLogin: function() {
                var url = getLoginURL([
                    'user-read-private',
					'playlist-read-private',
					'playlist-modify-public',
					'playlist-modify-private',
					'user-library-read',
					'user-library-modify',
					'user-follow-read',
					'user-follow-modify'
                ]);

                var width = 450, 
                    height = 730,
                    left = (screen.width / 2) - (width / 2);
                    top = (screen.height / 2) - (height / 2);

                var w = window.open(url,
                    'Spotify',
						'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                );
            },
            getAccessToken: function() {
                var expires = 0 + localStorage.getItem('pa_expires', '0');
                if ((new Date()).getTime() > expires) {
                    return;
                }
                var token = localStorage.getItem('pa_token', '');
                console.log(token);
                return token;
            },
            setAccessToken: function(token, expires_in) {
                localStorage.setItem('pa_token', token);
                localStorage.setItem('pa_expires', (new Date()).getTime() + expires_in);
            },
            getUsername: function() {
                var username = localStorage.getItem('username', '');
                return username;
            },
            setUsername: function(username) {
                localStorage.setItem('username', String(username));
            }
        }
    })
})();