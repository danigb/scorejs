'use strict';

module.exports = function(Score) {

  Score.fn.playChords = function(options) {
    this.each(function(event) {
      if(event.type == 'chord') {
        var notes = event.value.notes();
        for(var i = 0; i < notes.length; i++) {
          this.add(event.clone({ value: notes[i], type: 'note' }));
        }
        this.remove(event);
      }
    });
    return this;
  }
}
