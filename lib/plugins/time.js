'use strict';

module.exports = function(Score) {
  
  Score.fn.duration = function() {
    var last = this.events[this.events.length - 1];
    return last ? last.position + last.duration : 0;
  }
}
