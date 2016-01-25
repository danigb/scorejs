var tonal = require('tonal')

function Event () {}

Event.Note = function (note, dur, vel) {
  var n = tonal.note(note)
  return n ? [0, 1, 'note', n, 100] : null
}

function Seq (name, events) {
  var time = 0
  var seq = events.map(function (e) {
    e = e.slice()
    e[0] = time
    time += e[1]
    return e
  })
  return {
    name: name,
    events: seq,
    context: {}
  }
}

module.exports = { Seq, Event }
