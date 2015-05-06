'use strict';

module.exports = function($) {
  $.fn.playChords = function(options) {
    return this.map(function(event) {
      if(event.type == 'chord') {
        return event.value.notes().map(function(note) {
          return event.clone({
            value: note, type: 'note',
            fromChord: event.str(),
            instrument: options.instrument
          });
        });
      }
    });
  }
}
