'use strict';

/*
* Score
* =====
*
*/
function Score(data) {
  if (data instanceof Score) return source;
  // Sugar part: if is a string or array, return a Sequence
  if (!(this instanceof Score)) {
    if (typeof(data) == 'string' || Array.isArray(data)) {
      return new Score.Sequence(data);
    } else {
      return new Score(data);
    }
  }

  // Copy data
  this.data = {};
  for(var name in (data || {})) {
    this.data[name] = data[name];
  }

  // If data contains time, apply
  this.time = Score.Sequence.Time(this.data.time || "4/4");
  this.parts = {};
}

/*
* Parts
*/
Score.prototype.part = function(name, source) {
  if(arguments.length == 1) return this.parts[name];
  this.parts[name] = new Score.Sequence(source, this.time);
  return this;
}

/*
 * Plugin stuff
 */
Score.Sequence = require('./sequence.js')();
Score.Plugins = {};
Score.fn = Score.Sequence.prototype;

Score.plugins = function() {
  for(var i = 0; i < arguments.length; i++) {
    arguments[i](Score);
  }
}

module.exports = Score;
