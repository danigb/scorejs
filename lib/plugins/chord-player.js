'use strict';

module.exports = function($) {
  $.fn.playChords = function(options) {
    return this.morph(function(event, newSeq) {
      if(event.type() == 'chord') addChord(event, newSeq, options);
    });
  }
}

function addChord(event, newSeq, options) {
  event.value().notes().forEach(function(note) {
    newSeq.add(event, {
      value: note, type: 'note',
      fromChord: event.str(),
      instrument: options.instrument
    });
  });
}
