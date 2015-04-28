'use strict';

module.exports = function(timeKey, ticksPerBeat) {
  ticksPerBeat = ticksPerBeat | 96;
  var split = timeKey.split('/');
  var time = { beats: +split[0], sub: +split[1] };

  time.beat = ticksPerBeat;
  time.measure = time.beats * time.beat;

  time.for = function(dur, array) {
    return array.map(function(num) { return num * dur });
  }
  time.forBeats = function(a) { return time.for(time.beat, a); }
  return time;
}
