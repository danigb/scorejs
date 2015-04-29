'use strict';

var time = require('./time.js')('4/4');
/*
 * Score
 * =====
 *
 * Arguments:
 * - score: OPTIONAL, a string representing the score
 * - options: OPTIONAL, a hash with score options
 *
 */
function Score(source, options) {
  if (!(this instanceof Score)) return new Score(source, options);

  if (typeof(source) != 'string') {
    options = source;
    source = null;
  }

  var score = { tempo: 120, time: time };
  score.source = source;
  score.dest = [];
  Object.keys(options || {}).forEach(function(key) {
    score[key] = options[key];
  });

  return score;
}

module.exports = Score;
