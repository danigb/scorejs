var score = require('./score')
var measures = require('./measures').measures
var getChord = require('chord-dictionary')

/**
 * Create a chord names sequence
 *
 * @param {String} meter - the meter used in the measures
 * @param {String} measures - the chords
 * @param {Sequence} a sequence of chords
 *
 * @example
 * score.chords('4/4', 'C6 | Dm7 G7 | Cmaj7')
 */
function chords (meter, data) {
  return measures(meter, data, function (dur, el) {
    return score.el({ duration: dur, chord: el })
  })
}

/**
 * Convert a chord names sequence into a chord notes sequence
 */
var expandChords = score.map(function (el) {
  return el.chord
    ? score.sim(getChord(el.chord).map(score.note(el.duration))) : el
}, null)

/**
 * Create a harmony sequence
 */
function harmony (meter, data) {
  return expandChords(chords(meter, data))
}

module.exports = { chords: chords, expandChords: expandChords, harmony: harmony }
