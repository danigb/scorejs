'use strict';

var Time = require('./time.js');
var Event = require('./event.js');

module.exports = function(plugins) {
  /*
   * Score
   * =====
   *
   */
  function Score(source, data) {
    if (source instanceof Score) return source;
    if (!(this instanceof Score)) return new Score(source, data);

    if (!isValidSource(source)) {
      data = source;
      source = null;
    }

    // Copy data
    this.data = {};
    for(var name in (data || {})) {
      this.data[name] = data[name];
    }

    // If data contains source, apply
    if (this.data.source) {
      source = this.data.source;
      delete this.data.source;
    }

    // If data contains time, apply
    this.time = Score.Time(this.data.time || "4/4");

    this.parts = {};
    this.events = parseSource(this.time, source);
  }
  Score.Time = Time;
  Score.Event = Event;

  function parseSource(time, source) {
    if(!source) {
      return [];
    } else if(Array.isArray(source)) {
      return source.map(function(e) {
        return Score.Event(e);
      });
    } else {
      return Score.parse(time, source);
    }
  }

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
  if (plugins) {
    plugins.forEach(function(plugin) {
      Score.plugin(plugin);
    });
  }

  /*
   * Parts
   */
  Score.prototype.part = function(name, source, options) {
    if(arguments.length == 1) return this.parts[name];

    if(!isValidSource(source)) {
      options = source;
      source = null;
    }
    options = options || {};
    options.name = name;
    options.source = source;
    this.parts[name] = new Score(options);
    return this;
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

/*** PRIVATE ***/
function isValidSource(source) {
  return (typeof(source) == 'string' || Array.isArray(source));
}
