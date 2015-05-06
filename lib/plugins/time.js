'use strict';

var last = require('lodash/array/last');
var range = require('lodash/utility/range');

module.exports = function(Score) {

  Score.fn.duration = function() {
    var l = last(this.events);
    return l ? (l.position + l.duration) : 0;
  }

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

  // measures(0, 1)

  // select(begin, end)
}
