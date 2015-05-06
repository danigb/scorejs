'use strict';

module.exports = function($) {
  $.fn.leftHandPiano = function(options) {
    var options = options || {};
    var inst = options.instrument || 'piano';
    
    return this.map(function(event) {
      if(event.type == 'chord') {
        return event.value.notes().map(function(note) {
          return event.clone({
            value: note, type: 'note',
            fromChord: event.str(),
            instrument: inst
          });
        });
      }
    });
  }
}
