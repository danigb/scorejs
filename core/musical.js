'use strict';

var pitch = require('note-pitch');

module.exports = function(Score) {

  Score.fn.transpose = function(interval) {
    return Score(this, function(event) {
      var transposed = pitch.transpose(event.value, interval);
      return transposed ?
        Score.event(event, {value: transposed, type: 'note'}) : event;
    });
  }

  Score.fn.pitches = function() {
    return Score(this, function(event) {
      var p = pitch(event.value);
      return p ? Score.event(event, { pitch: p, type: 'note'}) : event;
    });
  }
}