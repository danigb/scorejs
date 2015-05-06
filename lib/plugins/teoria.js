'use strict';

var teoria = require('teoria');


function plugin(Score) {
  if(Score.Teoria) return;
  Score.Teoria = teoria;

  Score.fn.transpose = function(interval) {
    return this.map(function(e) {
      if(typeof(e.value.interval) === "function") {
        return e.clone({
          value: e.value.interval(interval)
        });
      }
    });
  }

  Score.fn.roots = function(duration) {
    return this.map(function(e) {
      if(typeof(e.value.root) !== "undefined") {
        return e.clone({
          value: e.value.root,
          duration: (duration || e.duration),
          type: 'note'
        });
      }
    });
  }

  // decorate the parse method to parse notes and chords
  var _parser = Score.Sequence.parse;
  Score.Sequence.parse = function(time, repr) {
    return strToTeoria(_parser(time, repr));
  }

  /*
   * parse notes and chords
   */
  function strToTeoria(events) {
    return events.map(function(event) {
      var note, chord, val = event.value;

      if((note = parseNote(val))) {
        return event.clone({ value: note, type: 'note' });
      } else if ((chord = parseChord(val))) {
        return event.clone({ value: chord, type: 'chord' });
      } else {
        return event;
      }
    });
  }

  var NOTE = /^([a-h])(x|#|bb|b?)(-?\d*)$/
  function parseNote(val) {
    try {
      if(NOTE.test(val)) return teoria.note(val);
    } catch(e) {};
    return null;
  }
  var CHORD = /^[A-H]/
  function parseChord(val) {
    try {
      if(CHORD.test(val)) return teoria.chord(val);
    } catch(e) {};
    return null;
  }
}

module.exports = plugin;
