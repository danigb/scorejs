'use strict'

var Note = require('note-pitch')

module.exports = function (Score) {
  Score.fn.transpose = function (interval) {
    return Score(this, function (event) {
      var transposed = Note.transpose(event.value, interval)
      return transposed ?
        Score.event(event, {value: transposed, type: 'note'}) : event
    })
  }

  Score.fn.notes = function (options) {
    return Score(this, function (event) {
      if (!event.note) {
        var note = Note.parse(event.value, null, null)
        if (note) {
          return Score.event(event, { note: note })
        } else {
          return null;
        }
      }
      return event;
    });
  }
}
