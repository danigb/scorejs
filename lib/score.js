'use strict';

var identity = require('lodash/utility/identity');

module.exports = function() {
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
  Score.prototype.part = function(name, source, proc) {
    proc = proc || identity;
    if(arguments.length == 1) {
      var part = this.parts[name];
      return part.proc(part.source);
    }
    var seq = new Score.Sequence(source, this.time);
    seq.score = this;
    this.parts[name] = { source: seq, proc: proc };
    return this;
  }

  /*
  * Plugin stuff
  */
  Score.Sequence = require('./sequence.js')();
  Score.fn = Score.Sequence.prototype;
  Score.addPlugin = function(plugin) { plugin(Score); }

  for(var i = 0; i < arguments.length; i++) {
    Score.addPlugin(arguments[i]);
  }

  return Score;
}
