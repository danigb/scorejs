
var range = require('lodash/utility/range');

module.exports = function(Score) {
  Score.fn.walkingBass = function(options) {
    options = options || {}

    var time = this.time;
    var duration = options.duration || time.beat;
    var instrument = options.instrument || 'bass';

    return this.roots().transpose('P-15').map(function(event) {
      var times = event.duration / duration;
      return range(times).map(function(i) {
        return event.clone({
          position: event.position + i * duration,
          duration: duration,
          instrument: instrument,
        });
      });
    });
  }
}
