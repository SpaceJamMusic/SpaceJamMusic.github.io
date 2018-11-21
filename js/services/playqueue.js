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
            }
        }
    });
})();