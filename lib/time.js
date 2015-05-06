'use strict';

function Time(timeKey, ticksPerBeat) {
  if(timeKey instanceof Time) return timeKey;
  if(!(this instanceof Time)) return new Time(timeKey, ticksPerBeat);

  this.ticksPerBeat = ticksPerBeat | 96;

  var split = timeKey.split('/');
  this.beats = +split[0];
  this.sub = +split[1];

  // size of a beat in ticks
  this.beat = this.ticksPerBeat;
  // size of a measure in ticks
  this.measure = this.beats * this.beat;
  // sugar: 4 * this.measures;
  this.measures = this.beats * this.beat;
}

Time.prototype.ticks = function(n) {
  return (4 / n) * this.ticksPerBeat;
}

Time.prototype.for = function(dur, array) {
    return array.map(function(num) { return num * dur });
  }
Time.prototype.forBeats = function(a) {
    return this.for(this.beat, a);
  }

module.exports = Time;
