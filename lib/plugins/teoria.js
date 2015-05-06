'use strict';

var teoria = require('teoria');



function plugin(Score) {
  if(Score.Plugins.Teoria) return;
  Score.Plugins.Teoria = true;

  Score.fn.transpose = function(interval) {
    return this.morph(function(e, newSeq) {
      if(typeof(e.value().interval) === "function") {
        newSeq.add(e, {value: e.value().interval(interval) });
      }
    });
  }

  // decorate the parse method to parse notes and chords
  var _parser = Score.Sequence.parse;
  Score.Sequence.parse = function(time, repr) {
    return parse(_parser(time, repr));
  }

  /*
   * parse notes and chords
   */
  function parse(events) {
    return events.map(function(event) {
      var note, chord, val = event.value();

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
  function parseChord(val) {
    try { return teoria.chord(val); } catch(e) { return null; }
  }
}

module.exports = plugin;
