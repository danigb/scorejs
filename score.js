'use strict';

var parseMeasures = require('measure-parser');
var parseMelody = require('melody-parser');
var identity = function(e) { return e; };


module.exports = function() {
  /*
   * Score
   *
   * @param {String | Array } source - the sequence source
   * @param {String} time [optional] - the time signature ("4/4" by default)
   * @param {Function} - the transformation function
   */
  function Score(source, time, transform) {
    if (!(this instanceof Score)) return new Score(source, time, transform);

    var hasTimeParam = (typeof(time) === 'string');
    this.time = hasTimeParam ? time : "4/4";

    if(typeof(source) === 'string') {
      this.sequence = parseMeasures(source, this.time) || parseMelody(source, this.time);
    } else if(Array.isArray(source)) {
      // it they are not events, create new events
      this.sequence = source.map(function(e) {
        return isEvent(e) ? e : Score.event(e);
      });
    } else {
      throw Error('Unkown source format: ' + source);
    }
    transform = hasTimeParam ? transform : time;
    transform = transform || identity;
    var apply = (typeof(transform) == 'function') ? applyFunction : applyObj;
    apply(this, transform);
  }
  /*
   * applyFunction(private)
   * map -> flatten - > compact -> sort
   */
  function applyFunction(score, transform) {
    score.sequence = [].concat.apply([], score.sequence.map(transform))
      .filter(function(e) {
        return e != null;
      })
      .sort(function(a, b) {
        return a.position - b.position;
      });
  }
  function applyObj(score, obj) {
    var result = score;
    for(var name in obj) {
      if(!score[name]) {
        throw Error("Sequence doesn't have '" + name + "' method. Maybe forgot a plugin?");
      } else {
        result = result[name].call(result, obj[name]);
      }
    }
    score.sequence = result.sequence;
  }

  function isEvent(e) {
    return typeof(e.value) !== 'undefined' &&
      typeof(e.position) !== 'undefined' &&
      typeof(e.duration) !== 'undefined';
  }

  /*
   * Score.event
   *
   * Clone or create events and merge parameters
   */
  Score.event = function(e) {
    var evt = { value: e.value || e,
      position: e.position || 0, duration: e.duration || 0 };
    if(arguments.length !== 1) {
      // merge values of each argument
      for(var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];
        for(var key in obj) {
          if(obj.hasOwnProperty(key)) {
            evt[key] = obj[key];
          }
        }
      }
    }
    return evt;
  }

  Score.merge = function() {
    var result = [];
    for(var i = 0, total = arguments.length; i < total; i++) {
      result = result.concat(arguments[i].sequence);
    }
    return new Score(result);
  }

  Score.concat = function() {
    var result = [], s, position = 0;
    for(var i = 0, total = arguments.length; i < total; i++) {
      s = arguments[i].transform(function (event) {
        event.position += position;
        return event;
      });
      result = result.concat(s.sequence);
      position += s.duration();
    }
    return new Score(result);
  }

  Score.prototype.transform = function(transform) {
    return new Score(this.sequence, transform);
  }

  Score.prototype.set = function (properties) {
    return this.transform(function(event) {

    })
  };

  Score.fn = Score.prototype;
  Score.use = function(plugin) {
    plugin(Score);
  }

  return Score;
}
