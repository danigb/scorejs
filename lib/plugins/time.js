'use strict';

var last = require('lodash/array/last');

module.exports = function(Score) {

  Score.fn.duration = function() {
    var l = last(this.events);
    return l ? (l.position() + l.duration()) : 0;
  }

  // measures(0, 1)

  // select(begin, end)
}
