(function() {

    var module = angular.module('SpaceJam');

    module.factory('PlayQueue', function(Playback, $rootScope) {
        var _queue = [];
        var _position = 0;

        return {
            /**
             * @param  {string} trackuri
             * @description plays the current track url
             * @example PlayQueue.play(')
             */
            play: function(trackid) {
                console.log('Clear queue and play track', trackid);
                _queue = [];
                _queue.push(trackid);
                _position = 0;
                $rootScope.$emit('playqueuechanged');
                Playback.startPlaying(trackid);
            },
            enqueue: function(trackuri) {
                console.log('in PlayQueue')
                console.log("Enqueue track", trackuri);
                _queue.push(trackuri);
                $rootScope.$emit('playqueuechanged');
            },
            enqueueList: function(trackuris) {
                console.log('Enqueue tracks', trackuris);
                trackuris.forEach(function(trackuri) {
                    _queue.push(trackuri);
                });
                $rootScope.$emit('playqueuechange');
            },
            playFrom: function(index) {
                _position = index;
                $rootScope.$emit('playqueuechanged');
                Playback.startPlaying(_queue[_position]);
            },
            getQueue: function() {
                return _queue;
            },
            getPosition: function() {
                return _position;
            },
            getCurrent: function() {
                if (_queue.length > 0) {
                    return _queue[_position];
                }

                return '';
            },
            clear: function() {
                _queue = [];
                _position = 0;
                $rootScope.$emit('playqueuechanged');
            },
            next: function() {
                console.log('playqueue: next');
                _position++;
                if (_position >= _queue.length) {
                    _position = 0;
                }
                $rootScope.$emit('playqueuechanged');
            },
            prev: function() {
                console.log('PlayQueue: prev');
                _position--;
                if (_position < 0) {
                    _position = _queue.length - 1;
                }
                $rootScope.$emit('playqueuechanged');
            }

        }
    });
})();