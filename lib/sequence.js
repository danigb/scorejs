'use strict';

var Time = require('./time.js');
var Event = require('./event.js');
var _ = require('./dash.js');

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

  Sequence.fn.map = function(iter) {
    iter = iter || _.identity;
    var events = _.flatten(_.compact(this.events.map(iter)));
    return new Sequence(_.sortBy(events, 'position'));
  }

  Sequence.fn.filter = function() {
    var args = Array.prototype.slice.call(arguments); // Make real array from arguments
    args.unshift(this.events);
    return new Sequence(_.filter.apply(this, args));
  }


  Sequence.fn.toString = function() {
    return this.events.map(function(e) { return e.str(); }).join(' ');
  }

  return Sequence;
}
