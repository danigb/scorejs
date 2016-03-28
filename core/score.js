'use strict'

var build = require('./build')
var slice = Array.prototype.slice
var isArray = Array.isArray
var isCollection = function (a) { return isArray(a) && typeof a[0] !== 'string' }

function typeOf (obj) {
  if (typeof obj.duration !== 'undefined') return 'event'
  else if (isArray(obj)) return obj[0]
}

/**
 * @name score
 * @module score
 */
var score = function (data) {
  return build(score, data)
}

/**
 * Create a score element: an object with duration
 *
 * It's accepts any data you supply, but duration property has a special
 * meaning: it's a number representing the duration in arbitrary units.
 * It's assumed to be 0 (no duration) if not present or not a valid number
 *
 * @param {Number} duration - the element duration
 * @param {Object} data - the additional element data
 */
score.el = function (d, data) {
  return Object.assign({ duration: +d || 0 }, data)
}

/**
 * Create a note
 *
 * @param {String|Integer} pitch - the note pitch
 * @param {Integer} duration - (Optional) the note duration (1 by default)
 * @param {Hash} attributes - (Optional) note attributes
 * @return {Hash} a note
 *
 * @example
 * score.note('A') // => { duration: 1, pitch: 'A' }
 * score.note('A', 0.5) // => { duration: 0.5, pitch: 'A' }
 * score.note('A', 2, { inst: 'piano' }) // => { duration: 2, pitch: 'A', inst: 'piano' }
 */
score.note = function (pitch, dur, params) {
  var n = { pitch: pitch, duration: dur || 1 }
  if (params) Object.assign(n, params)
  return n
}

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

/**
 * Create a sequential musical structure
 *
 * @example
 * score.seq(score.note('A'), score.note('B'))
 */
score.seq = structureAs('seq')

/**
 * Create a parallel musical structure
 *
 * @example
 * score.par(score.note('A'), score.note('B'))
 */
score.par = structureAs('par')

// Create musical structures from function arguments
function structureAs (name) {
  return function () {
    return [name].concat(isCollection(arguments[0]) ? arguments[0] : slice.call(arguments))
  }
}

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
score.phrase = function (p, d, a) { return score.seq(notes(p, d, a)) }

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
score.chord = function (p, d, a) { return score.par(notes(p, d, a)) }

/**
 * Transform a musical structure
 *
 * This is probably the most important function. It allows complex
 * transformations of musical structures using three functions
 */
score.transform = function (nt, st, pt, obj, ctx) {
  if (arguments.length > 3) return score.transform(nt, st, pt)(obj, ctx)

  var T = function (obj, ctx) {
    switch (typeOf(obj)) {
      case 'event': return nt(obj, ctx)
      case 'seq': return st(obj.slice(1).map(T), ctx)
      case 'par': return pt(obj.slice(1).map(T), ctx)
      default: return obj
    }
  }
  return T
}

/**
* Map the notes of a musical structure using a function
*
* @param {Function} fn - the function used to map the notes
* @param {Score} score - the score to transform
* @param {Object} ctx - (Optional) a context object passed to the function
* @return {Score} the transformed score
*/
score.map = function (nt, obj, ctx) {
  if (arguments.length > 1) return score.map(nt)(obj, ctx)
  return score.transform(nt, score.seq, score.par)
}

module.exports = score
