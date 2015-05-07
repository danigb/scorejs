'use strict';

var _ = require('./dash.js');

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

    // Set data...
    this.data = _.assign({}, data);
    // ... and defaults
    this.data.time = this.data.time || "4/4";
    this.data.parts = this.data.parts || {};
    for (var partName in this.data.parts) {
      setPart(this, partName);
    }

    this.time = Score.Sequence.Time(this.data.time);
  }

  /*
  * PART - the sugar method
  */
  Score.prototype.part = function(name, source, proc) {
    return (arguments.length == 1) ?
      getPart(this, name) : setPart(this, name, source, proc);
  }

  // Private getter and setter
  function setPart(score, name, source, proc) {
    var part = score.data.parts[name] = score.data.parts[name] || {};
    part.source = source || part.source;
    part.processor = proc || part.processor || buildProcessor(part);
    part.source = Score.Sequence(part.source, score.time);
    part.source.score = score;
    return score;
  }

  function getPart(score, name) {
    var part = score.data.parts[name];
    var processor = part.processor;
    return processor(part.source);
  }


  function buildProcessor(part) {
    return function(seq) {
      var args;
      for(name in part) {
        if (name !== 'source' && name !== 'processor') {
          args = part[name];
          if(!seq[name]) {
            throw Error("Sequence doesn't have '" + name + "' method. Maybe forgot a plugin?")
          }
          seq = seq[name].apply(seq, args);
        }
      }
      return seq;
    }
  }

  /*
   * PLUGINS
   */
  /*
   * Add a new sequence object to each Score function
   * in order to have different plugins to different
   * scores/sequences.
   */
  Score.Sequence = require('./sequence.js')();
  Score.fn = Score.Sequence.prototype;

  /*
  * Apply plugins
  */
  Score.addPlugin = function(plugin) { plugin(Score); }
  for(var i = 0; i < arguments.length; i++) {
    Score.addPlugin(arguments[i]);
  }

  return Score;
}
