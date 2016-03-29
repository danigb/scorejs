var score = require('./score')
var measures = require('./measures').measures
var getChord = require('chord-dictionary')

function chords (meter, data) {
  return measures(meter, data, function (el, dur) {
    return score.el({ duration: dur, chord: el })
  })
}

var harmony = score.map(function (el) {
  return !el.chord ? el
    : score.sim(getChord(el.chord).map(function (pitch) {
      return score.note(pitch, el.duration)
    }))
})

module.exports = { chords: chords, harmony: harmony }
