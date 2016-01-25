var tonal = require('tonal')

function event (event, mod) {
  return Object.assign({ type: 'event', time: 0 }, event, mod)
}

function * note (note, dur) {
  var n = tonal.note(note)
  if (n) yield event({ type: 'note', val: n, dur: dur || 1 })
}

function * notes (notes, dur) {
  if (typeof notes === 'string') notes = notes.split(/\s+/)
  for (var n of notes) {
    yield note(n, dur).next().value
  }
}

function * rest (dur) {
  yield event({ type: 'rest', dur: dur || 1 })
}

function * chord (notes, dur) {
  if (typeof notes === 'string') notes = tonal.chord(notes)
  for (var n of notes) yield event({ type: 'note', val: n, dur: dur || 1 })
}

function * sequence (events) {
  var time = 0
  for (var i = 0, len = events.length; i < len; i++) {
    for (var e of events[i]) {
      var f = event(e, { time: time })
      time += f.dur || 0
      yield f
    }
  }
}

module.exports = { event, note, rest, chord, notes, sequence, arr: Array.from }
