'use strict';

var teoria = require('teoria');

var NOTE = /^([a-h])(x|#|bb|b?)(-?\d*)/

function plugin(Score) {

  // decorate the parse method to parse notes and chords
  var _parser = Score.parse;
  Score.parse = function(time, repr) {
    return parse(_parser(time, repr));
  }

  Score.fn.transpose = function(interval) {
    return this.each(function(e) {
      if(typeof(e.value.transpose) === "function") {
        e.value.transpose(interval);
      }
    });
  }
}

function parse(events) {
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
