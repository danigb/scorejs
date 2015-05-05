'use strict';

module.exports = function($) {
  $.fn.playChords = function(options) {
    options = $.merge({}, options);

    return this.morph(function(seq, event) {
      if(event.type == 'chord') addChord(event, seq);
    });
  }
}

function addChord(event, sequence) {
  event.value().notes().forEach(function() {
    seq.add(event, {
      value: notes[i], type: 'note',
      fromChord: event.str(),
      instrument: options.instrument
    });
  });
}
