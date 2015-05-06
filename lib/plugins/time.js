'use strict';

var last = require('lodash/array/last');
var range = require('lodash/utility/range');

module.exports = function(Score) {

  Score.fn.duration = function() {
    var l = last(this.events);
    return l ? (l.position + l.duration) : 0;
  }

  /*
   * Repeat a sequence 'times' times
   */
  Score.fn.repeat = function(times) {
    var duration = this.duration();
    return this.map(function(event) {
      return range(times).map(function(i) {
        return event.clone({
          position: event.position + i * duration
        });
      });
    });
  }

  /*
   * Delay
   * Repeat each event
   * Params:
   * - distance: space between the event and the delayed event in ticks
   * - repeat: number of delays (1 by default)
   */
  Score.fn.delay = function(distance, options) {
    options = options || {};
    options.repeat = options.repeat || 1;
    options.distance = options.distance || distance;

    return this.map(function(event) {
      return range(options.repeat + 1).map(function(i) {
        return event.clone({
          position: event.position + i * options.distance
        });
      });
    })
  }

  // measures(0, 1)

  // select(begin, end)
}
