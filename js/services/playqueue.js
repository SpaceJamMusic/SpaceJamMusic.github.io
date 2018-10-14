(function() {

    var module = angular.module('SpaceJam');

    module.factory('PlayQueue', function(Playback, $rootScope) {
        var _queue = [];
        var _position = 0;

        return {
            play: function(trackuri) {
                console.log('Clear queue and play track', trackuri);
                _queue = [];
                _queue.push(trackuri);
                _position = 0;
                $rootScope.$emit('playqueuechanged');
                Playback.startPlaying(trackuri);
            }
        }
    });
})();