(function() {

    var module = angular.module('SpaceJam');

    module.factory('PlayQueue', function(Playback, $rootScope) {
        var _queue = [];
        var _position = 0;

        return {
            /**
             * @param  {string} trackuri
             * @description plays the current track url
             * @example PlayQueue.play('')
             */
            play: function(trackuri) {
                console.log('Clear queue and play track', trackuri);
                _queue = [];
                _queue.push(trackuri);
                _position = 0;
                $rootScope.$emit('playqueuechanged');
                Playback.startPlaying(trackuri);
            },
            /**
             * @param  {} trackuri
             * @description adds track to play queue
             * @example PlayQueue.enqueue('track')
             */
            enqueue: function(trackuri) {
                console.log('in PlayQueue')
                console.log("Enqueue track", trackuri);
                _queue.push(trackuri);
                $rootScope.$emit('playqueuechanged');
            },
            /**
             * @param  {} trackuris
             * @description adds list of tracks to play queue
             * @example PlayQueue.enqueueList
             */
            enqueueList: function(trackuris) {
                clear();
                console.log('Enqueue tracks', trackuris);
                trackuris.forEach(function(trackuri) {
                    _queue.push(trackuri);
                });
                $rootScope.$emit('playqueuechange');
            },
            /**
             * @param  {} index
             * @description play track from index in queue
             * @example PlayQueue.playFrom(index)
             */
            playFrom: function(index) {
                _position = index;
                $rootScope.$emit('playqueuechanged');
                Playback.startPlaying(_queue[_position]);
            },
            /**
             * @description returns the current track queue
             * @example PlayQueue.getQueue()
             */
            getQueue: function() {
                return _queue;
            },
            /**
             * @description gets the current position in the track queue
             * @example PlayQueue.getPosition()
             */
            getPosition: function() {
                return _position;
            },
            /**
             * @description returns the current playing track
             * @example PlayQueue.getCurrent()
             */
            getCurrent: function() {
                if (_queue.length > 0) {
                    return _queue[_position];
                }

                return '';
            },
            /**
             * @description clears the queue of all existing tracks
             * @example PlayQueue.clear()
             */
            clear: function() {
                _queue = [];
                _position = 0;
                $rootScope.$emit('playqueuechanged');
            },
            /**
             * @description changes position the next track in the queue
             * @example PlayQueue.next()
             */
            next: function() {
                console.log('playqueue: next');
                _position++;
                if (_position >= _queue.length) {
                    _position = 0;
                }
                $rootScope.$emit('playqueuechanged');
            },
            /**
             * @description changes position to the previous track in the queue
             * @example PlayQueue.prev()
             */
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