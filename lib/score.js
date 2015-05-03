'use strict';

module.exports = Score;

var time = require('./time.js');
var event = require('./event.js');
/*
 * Score
 * =====
 *
 * Arguments:
 * - score: OPTIONAL, a string representing the score
 * - options: OPTIONAL, a hash with score._options
 *
 */
function Score(source, options) {
  if (source instanceof Score) return source;
  if (!(this instanceof Score)) return new Score(source, options);

  if(source === undefined) {
    source = [];
    options = {};
  } else if(options === undefined) {
    if(typeof(source) === 'object') {
      options = source;
      source = [];
    } else {
      options = {};
    }
  }

  this.time = time(options.time || "4/4");

  if(Array.isArray(source)) {
    this.events = source.map(function(e) {
      return event(e);
    });
  } else {
    this.events = Score.parse(this.time, source);
  }
}
Score.parse = require('./parser.js');

Score.fn = Score.prototype;

Score.fn.length = function() {
  var last = this.events[this.events.length - 1];
  return last ? last.position + last.duration : 0;
}
