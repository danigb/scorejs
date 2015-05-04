'use strict';

var teoria = require('teoria');

var NOTE = /^([a-h])(x|#|bb|b?)(-?\d*)/

function plugin(Score) {

  var _parser = Score.parse;

  Score.parse = function(time, repr) {
    return teoriaEvents(_parser(time, repr));
  }

  Score.Note = teoria.TeoriaNote;
  Score.Chord = teoria.TeoriaChord;
}

function teoriaEvents(events) {
  events.forEach(function(event) {
    if(NOTE.test(event.value)) {
      try {
        var note = teoria.note(event.value);
        event.merge({ value: note, type: 'note' });
      } catch(e) {}
    } else {
      try {
        var chord = teoria.chord(event.value);
        event.merge({ value: chord, type: 'chord' });
      } catch(e) {}
    }
  });
  return events;
}

module.exports = plugin;
