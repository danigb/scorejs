'use strict';

module.exports = function(Score) {

  Score.fn.playChords = function(opts) {
    opts = opts || {};
    var options = {
      instrument: opts.instrument || 'piano'
    }

    this.each(function(event) {
      if(event.type == 'chord') {
        var notes = event.value.notes();
        for(var i = 0; i < notes.length; i++) {
          this.add(event.clone({ value: notes[i], type: 'note',
            fromChord: event.str(), instrument: options.instrument }));
        }
        this.remove(event);
      }
    });
    return this;
  }
}
