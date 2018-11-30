(function() {
    //Serves as the Playback Controller
    //Allows the user to play and pause songs

    var module = angular.module('SpaceJam');

    module.factory('Playback', function($rootScope, API, $interval) {
        var _playing = false;
        var _track = '';
        var _volume = 50;
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
            if (ticktimer != 0) {
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
            /**
             * @description gets the current volume value
             * @example Playback.getVolume
             */
            getVolume: function() {
                return _volume;
            },
            /**
             * @param  {int} v
             * @description sets the new volume value
             * @example Playback.setVolume('volume value')
             */
            setVolume: function(v) {
                _volume = v;
                audiotag.volume = _volume / 100.0;
            },
            /**
             * @param  {string} trackuri
             * @description starts playing the provided track url
             * @example Playback.startPlaying('spotify url of track')
             */
            startPlaying: function(trackuri) {
                console.log('Playback::startPlaying', trackuri);
                _track = trackuri;
                _trackdata = null;
                _playing = true;
                _progress = 0;
                var trackid = trackuri.split(':')[2];

                audiotag.src='';
                audiotag.play();
                audiotag.pause();

                API.getTrack(trackid).then(function(trackdata) {
                    console.log('playback got track', trackdata);
                    createAndPlayAudio(trackdata.data.preview_url, function()  {
                        _trackdata = trackdata;
                        _progress = 0;
                        $rootScope.$emit('playerchanged');
                        $rootScope.$emit('trackprogress');
                        enableTick();
                    });
                });
            },
            /**
             * @description pauses the current playing track
             * @example Playback.pause()
             * @emits 'playerchanged'
             */
            pause: function() {
                if (_track != '') {
                    _playing = false;
                    audiotag.pause();
                    $rootScope.$emit('playerchanged');
                    disableTick();
                }
            },
            /**
             * @description resumes the current playing track
             * @example Playback.resume()
             * @emits 'playerchanged
             */
            resume: function() {
                if (_track != '') {
                    _playing = true;
                    audiotag.play();
                    $rootScope.$emit('playerchanged');
                    enableTick();
                }
            },
            isPlaying: function() {
				return _playing;
			},
            /**
             * @description gets the current tracks associated data
             * @example Playback.getTrackData()
             */
            getTrackData: function() {
                return _trackdata;
            },
            /**
             * @description gets the playback progress of the current playing song
             * @example Playback.getProgress()
             */
            getProgress: function() {
                return _progress;
            },
            getTrack: function() {
				return _track;
			},
            /**
             * @description gets the playback duration of the current playing song
             * @example Playback.getDuration()
             */
            getDuration: function() {
                return _duration;
            }
        }
    })
})();