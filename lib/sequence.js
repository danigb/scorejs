'use strict';

var Time = require('./time.js');
var Event = require('./event.js');

module.exports = function() {
  /*
   * Sequence
   * =====
   *
   */
  function Sequence(source, time) {
    if (source instanceof Sequence) return source;
    if (!(this instanceof Sequence)) return new Sequence(source);

    // If data contains time, apply
    this.time = Sequence.Time(time || "4/4");
    this.events = parseSource(this.time, source);
  }

  function parseSource(time, source) {
    if(!source) {
      return [];
    } else if(Array.isArray(source)) {
      return source.map(function(e) {
        return Sequence.Event(e);
      });
    } else {
      return Sequence.parse(time, source);
    }
  }

  /*
   * Static
   */
  Sequence.parse = require('./parser.js');
  Sequence.Time = Time;
  Sequence.Event = Event;

  Sequence.fn = Sequence.prototype;

  Sequence.fn.map = function(iteratee) {
    return new Sequence(this.events.map(iteratee));
  }

  // TODO: remove
  Sequence.fn.value = function(n) { return this.events[n].value(); }

  Sequence.fn.toString = function() {
    return this.events.map(function(e) { return e.str(); }).join(' ');
  }

  Sequence.fn.clone = function() {
    var callback = function(e) { return e; };
    return new Sequence(this.events.map(callback), this.data);
  }

  Sequence.fn.morph = function(callback) {
    var newSeq = new Sequence();
    newSeq.add = function(event, data) {
      newSeq.events.push(event.clone(data));
    };
    this.events.forEach(function(event) {
      callback(event, newSeq, this);
    });
    newSeq.add = null;
    return newSeq;
  };

  return Sequence;
}
