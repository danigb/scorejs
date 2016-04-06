'use strict'

/**
 * @module Score
 */
var isArray = Array.isArray
var slice = Array.prototype.slice
var assign = Object.assign
function typeOf (obj) { return isArray(obj) ? obj[0] : 'el' }
function isStruct (e) { return isArray(e) && typeof e[0] === 'string' }
// create a sequence builder
function builder (name) {
  return function (elements) {
    if (arguments.length > 1) return [name].concat(slice.call(arguments))
    else if (isStruct(elements)) return [name, elements]
    return [name].concat(elements)
  }
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
function el (d, data) {
  if (typeof d === 'object') return assign({}, d, data)
  else return assign({ duration: +d || 0 }, data)
}

/**
 * Create a note from duration and pitch
 *
 * A note is any object with duration and pitch attributes. The duration
 * must be a number, but the pitch can be any value (although only strings with
 * scientific notation pitches and midi numbers are recogniced by the manipulation
 * or display functions)
 *
 * If only duration is provided, a partially applied function is returned.
 *
 * @param {Integer} duration - the note duration
 * @param {String|Integer} pitch - the note pitch
 * @param {Hash} data - (Optional) arbitraty note data
 * @return {Hash} a note
 *
 * @example
 * score.note(1, 'A') // => { duration: 1, pitch: 'A' }
 * score.note(0.5, 'anything') // => { duration: 0.5, pitch: 'anything' }
 * score.note(2, 'A', 2, { inst: 'piano' }) // => { duration: 2, pitch: 'A', inst: 'piano' }
 *
 * @example
 * // partially applied
 * ['C', 'D', 'E'].map(score.note(1)) // => [{ duration: 1, pitch: 'C'},
 *   { duration: 1, pitch: 'D'}, { duration: 1, pitch: 'E'}]
 */
function note (dur, pitch, data) {
  if (arguments.length === 1) return function (p, d) { return note(dur, p, d) }
  return assign({ pitch: pitch, duration: dur || 1 }, data)
}

/**
 * Create a musical structure where elements are sequenetial
 *
 * @param {Array} elements - an array of elements
 * @return {Array} the sequential musical structure
 *
 * @example
 * score.sequential([score.note('A'), score.note('B')])
 */
var seq = builder('seq')

/**
 * Create a musical structure where elements are simultaneous
 *
 * @example
 * score.sim([score.note('A'), score.note('B')])
 */
var sim = builder('sim')

/**
 * Transform a musical structure
 *
 * This is probably the most important function. It allows complex
 * transformations of musical structures using three functions
 *
 * @param {Function} elTransform - element transform function
 * @param {Function} seqTransform - sequential structure transform function
 * @param {Function} parTransform - simultaneous structure transform function
 * @param {*} ctx - an additional object passed to transform functions
 * @param {Object} score - the score to transform
 * @return {*} the result of the transformation
 */
function transform (nt, st, pt, ctx, obj) {
  switch (arguments.length) {
    case 0: return transform
    case 1:
    case 2:
    case 3: return transformer(nt, st, pt)
    case 4: return function (o) { return transformer(nt, st, pt)(ctx, o) }
    default: return transformer(nt, st, pt)(ctx, obj)
  }
}

function transformer (nt, st, pt) {
  var T = function (ctx, obj) {
    var m = function (o) { return T(ctx, o) }
    switch (typeOf(obj)) {
      case 'el': return nt(obj, ctx)
      case 'seq': return st(obj.slice(1).map(m), ctx)
      case 'sim': return pt(obj.slice(1).map(m), ctx)
      default: return obj
    }
  }
  return T
}

/**
* Map the notes of a musical structure using a function
*
* @param {Function} fn - the function used to map the notes
* @param {Object} ctx - a context object passed to the function
* @param {Score} score - the score to transform
* @return {Score} the transformed score
*/
function map (fn, ctx, obj) {
  switch (arguments.length) {
    case 0: return map
    case 1: return transform(fn, buildSeq, buildSim)
    case 2: return function (obj) { return map(fn)(ctx, obj) }
    case 3: return map(fn)(ctx, obj)
  }
}
function buildSeq (el, ctx) { return seq(el) }
function buildSim (el, ctx) { return sim(el) }

module.exports = {
  el: el, note: note,
  seq: seq, sequentially: seq,
  sim: sim, simultaneosly: sim,
  transform: transform, map: map }
