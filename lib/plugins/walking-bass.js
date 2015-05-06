
var range = require('lodash/utility/range');

module.exports = function(Score) {
  Score.fn.walkingBass = function() {
    var time = this.time;
    var duration = time.beat;
    return this.roots().map(function(event) {
      var times = event.duration / duration;
      return range(times).map(function(i) {
        return event.clone({
          position: event.position + i * duration,
          duration: duration
        });
      });
    });
  }
}
