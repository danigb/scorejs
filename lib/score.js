'use strict';

var Time = require('./time.js');
var Event = require('./event.js');

module.exports = function() {
  /*
   * Score
   * =====
   *
   */
  function Score(source, data) {
    if (source instanceof Score) return source;
    if (!(this instanceof Score)) return new Score(source, data);

    if(source === undefined) {
      source = [];
      data = {};
    } else if(data === undefined) {
      if(typeof(source) === 'object') {
        data = source;
        source = [];
      } else {
        data = {};
      }
    }

    this.time = Score.Time(data.time || "4/4");
    this.data = {};

    if(Array.isArray(source)) {
      this.events = source.map(function(e) {
        return Score.Event(e);
      });
    } else {
      this.events = Score.parse(this.time, source);
    }
  }
  Score.Time = Time;
  Score.Event = Event;

  /*
   * Global methods
   */
  Score.parse = require('./parser.js');

  /*
   * Plugin chain
   */
  Score.plugin = function(plugin) {
    plugin(Score);
  }
  for(var i = 0; i < arguments.length; i++) {
    Score.plugin(arguments[i]);
  }

  /*
   * Internal 'plugins'
   */
  Score.fn = Score.prototype;

  Score.fn.length = function() {
    var last = this.events[this.events.length - 1];
    return last ? last.position + last.duration : 0;
  }

  Score.fn.each = Score.fn.forEach = function(callback) {
    this.events.forEach(callback);
    return this;
  }

  Score.fn.map = function(callback) {
    return new Score(this.events.map(callback), this.data);
  }

  Score.fn.clone = function() {
    return this.map(function(e) { return e; });
  }

  return Score;
}
