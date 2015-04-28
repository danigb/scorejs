'use strict';

module.exports = Score;

function Score(opts) {
  if (!(this instanceof Score)) return new Score(opts);
  this.parts = {};
}

Score.prototype.set = function(name, repr) {
  return this.parts[name] = repr;
}

Score.time = require('./lib/time.js');
Score.scale = require('./lib/scale.js');
