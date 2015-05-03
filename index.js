'use strict';
(function() {
  var Score = require('./lib/score.js');
  Score.Event = require('./lib/event.js');
  Score.Time = require('./lib/time.js');

  Score.version = "0.2.0";
  if (typeof define === "function" && define.amd) define(function() { return Score; });
  else if (typeof module === "object" && module.exports) module.exports = Score;
  else this.Score = Score;
})();
