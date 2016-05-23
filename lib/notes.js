/** @module notes */

var score = require('./score')

// ======== UTILITY ========
// This is an utility function to create array of notes quickly.
function notes (pitches, durations, params) {
  var p = toArray(pitches || null)
  var d = toArray(durations || 1)
  return p.map(function (pitch, i) {
    return score.note(+d[i % d.length], pitch, params)
  })
}

// convert anything to an array (if string, split it)
function toArray (obj) {
  if (Array.isArray(obj)) return obj
  else if (typeof obj === 'string') return obj.trim().split(/\s+/)
  else return [ obj ]
}

// ======= API ========

/**
 * Create a phrase (a sequential structure of notes)
 *
 * @param {String|Array} pitches - the phrase note pitches
 * @param {String|Array} durations - the phrase note durations
 * @param {Hash} attributes - the phrase note attributes
 * @return {Array} a sequential musical structure
 *
 * @example
 * score.phrase('A B C D E', 1)
 */
function phrase (p, d, a) { return score.seq(notes(p, d, a)) }

/**
 * Create a collection of simultaneus notes
 *
 * You can specify a collection of pitches, durations and attributes
 * and `chord` will arrange them as a collection of notes in simultaneus
 * layout
 *
 * @param {String|Array} pitches - the chord note pitches
 * @param {String|Array} durations - the chord note durations
 * @param {Hash} attributes - the chord note attributes
 * @return {Array} a parallel musical structure
 *
 * @example
 * score.phrase('A B C D E', 1)
 */
function chord (p, d, a) { return score.sim(notes(p, d, a)) }

module.exports = { phrase: phrase, chord: chord }
