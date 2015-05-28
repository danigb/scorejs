'use strict';

var pitch = require('note-pitch');

module.exports = function(Score) {

  Score.fn.transpose = function(interval ) {
    return this.transform(function(event) {
      var transposed = pitch.transpose(event.value, interval);
      if (transposed) {
        event.type = 'note';
        event.value = transposed;
      }
      return event;
    });
  }

  Score.fn.pitches = function() {
    return this.transform(function(event) {
      var p = pitch(event.value);
      if (p) {
        event.type = 'note';
        event.pitch = p;
      }
      return event;
    });
  }
}
