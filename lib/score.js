'use strict';

module.exports = function(Sequence) {
  /*
  * Score
  * =====
  *
  */
  function Score(data) {
    if (data instanceof Score) return source;
    if (!(this instanceof Score)) return new Score(data);

    // Copy data
    this.data = {};
    for(var name in (data || {})) {
      this.data[name] = data[name];
    }

    // If data contains time, apply
    this.time = Sequence.Time(this.data.time || "4/4");
    this.parts = {};
  }

  /*
  * Parts
  */
  Score.prototype.part = function(name, source) {
    if(arguments.length == 1) return this.parts[name];
    this.parts[name] = new Sequence(source, this.time);
    return this;
  }

  return Score;
}
