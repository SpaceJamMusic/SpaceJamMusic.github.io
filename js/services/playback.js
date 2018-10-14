(function() {
    //Serves as the Playback Controller
    //Allows the user to play and pause songs

    var module = angular.module('SpaceJam');

    module.factory('Playback', function($rootScope, API, $interval) {
        var _playing = false;
        var _track = '';
        var _volume = 100;
        var _progress = 0;
        var _duration = 0;
        var _trackdata = null;

        function tick() {
            if (!_playing) {
                return;
            }

            _progress = audiotag.currentTime * 1000.0;

            $rootScope.$emit('trackprogress');
        }

        var ticktimer = 0;

        function enableTick() {
            disableTick();
            ticktimer = $interval(tick, 100);
        }

        function disableTick() {
            if (ticktime != 0) {
                $interval.cancel(ticktimer);
            }
        }
        
        var audiotag = new Audio();

        function createAndPlayAudio(url, callback, endcallback) {
            console.log('createAndPlayAudio', url);
            if (audiotag.src != null) {
                audiotag.pause();
                audiotag.src = null;
            }
            audiotag.src = url;
            audiotag.addEventListener('loadedmetadata', function() {
                console.log('audiotag loadedmetadata');
                _duration = audiotag.duration * 1000.0;
                audiotag.volume = _volume / 100.0;
                audiotag.play();
                callback();
            }, false)
            audiotag.addEventListener('ended', function() {
                console.log('audiotag ended');
                _playing = false;
                _track = '';
                disableTick();
                $rootScope.$emit('endtrack');
            }, false)
        }
        
        return {
            getVolume: function() {
                return _volume;
            },
            setVolume: function(v) {
                _volume = v;
                audiotag.volume = _volume / 100.0;
            },
            startPlaying: function(trackuri) {
                console.log('Playback::startPlaying', trackuri);
                _track = trackuri;
                _trackdata = null;
                _playing = true;
                _progress = 0;
                var trackid = trackuri.split(':')[2];

                autdiotag.src='';
                audiotag.play();
                audiotag.pause();

                API.getTrack(trackid).then(function(trackdata) {
                    console.log('playback got track', trackdata);
                    createAndPlayAudio(trackdata.preview_url, function()  {
                        _trackdata = trackdata;
                        _progress = 0;
                        $rootScope.$emit('playerchanged');
                        $rootScope.$emit('trackprogress');
                        enableTick();
                    });
                });
            }
        }
    })
})();