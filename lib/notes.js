var score = require('./score')

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
function phrase (p, d, a) { return score.sequential(notes(p, d, a)) }

/**
 * Create a chord (a parallel structure of notes)
 *
 * @param {String|Array} pitches - the chord note pitches
 * @param {String|Array} durations - the chord note durations
 * @param {Hash} attributes - the chord note attributes
 * @return {Array} a parallel musical structure
 *
 * @example
 * score.phrase('A B C D E', 1)
 */
function chord (p, d, a) { return score.parallel(notes(p, d, a)) }

/**
 * This is an utility function to create array of notes quickly.
 *
 * @param {Array|String} pitches - the pitches of the notes
 * @param {Array|String} durations - the durations of the notes
 * @param {Hash} attributes - the attributes of the notes
 * @api private
 */
function notes (pitches, durations, params) {
  var p = toArray(pitches || null)
  var d = toArray(durations || 1)
  return p.map(function (pitch, i) {
    return score.note(pitch, +d[i % d.length], params)
  })
}

// convert anything to an array
// it its a string, split it by spaces
function toArray (obj) {
  if (Array.isArray(obj)) return obj
  else if (typeof obj === 'string') return obj.trim().split(/\s+/)
  else return [ obj ]
}

module.exports = { phrase: phrase, chord: chord }
