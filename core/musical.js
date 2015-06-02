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

  Score.fn.notes = function () {
    return Score(this, function (event) {
      var note = event.note || Note.parse(event.value)
      return note ? Score.event(event, { note: note }) : event
    });
  }
}
