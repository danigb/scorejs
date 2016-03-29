var score = require('./score')
var measures = require('./measures').measures
var getChord = require('chord-dictionary')

function chords (meter, data) {
  return measures(meter, data, function (dur, el) {
    return score.el({ duration: dur, chord: el })
  })
}

var harmony = score.map(function (el) {
  return el.chord
    ? score.sim(getChord(el.chord).map(score.note(el.duration))) : el
})

module.exports = { chords: chords, harmony: harmony }
