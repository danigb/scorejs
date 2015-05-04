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
   * Public stuff
   */
  Score.parse = require('./parser.js');
  Score.Time = Time;
  Score.Event = Event;

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
    if(source) options.source = source;
    this.parts[name] = new Score(options);
    return this;
  }

  /*
   * Plugin chain
   */
  Score.fn = Score.prototype;
  Score.plugin = function(plugin) {
    plugin(Score);
  }
  if (plugins) {
    plugins.forEach(function(plugin) {
      Score.plugin(plugin);
    });
  }

  Score.fn.each = Score.fn.forEach = function(callback) {
    var trans = new Transaction();
    this.events.forEach(callback, trans);
    trans.finish(this);
    return this;
  }

  Score.fn.clone = function() {
    var callback = function(e) { return e; };
    return new Score(this.events.map(callback), this.data);
  }

  return Score;
}

/*** PRIVATE ***/
function isValidSource(source) {
  return (typeof(source) == 'string' || Array.isArray(source));
}

function Transaction() {
  this.toAdd = [];
  this.toRemove = [];
}
Transaction.prototype.add = function(event) { this.toAdd.push(event); }
Transaction.prototype.remove = function(event) { this.toRemove.push(event); }
Transaction.prototype.finish = function(score) {
  var self = this;
  if(self.toRemove.length > 0)
    score.events = score.events.filter(function(e) {
      return self.toRemove.indexOf(e) == -1;
    });
  if(self.toAdd.length > 0)
    score.events = score.events.concat(this.toAdd);
}
