'use strict'

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
 * Create a note
 *
 * @param {String|Integer} pitch - the note pitch
 * @param {Integer} duration - (Optional) the note duration (1 by default)
 * @param {Hash} data - (Optional) arbitraty note data
 * @return {Hash} a note
 *
 * @example
 * score.note('A') // => { duration: 1, pitch: 'A' }
 * score.note('A', 0.5) // => { duration: 0.5, pitch: 'A' }
 * score.note('A', 2, { inst: 'piano' }) // => { duration: 2, pitch: 'A', inst: 'piano' }
 */
function note (pitch, dur, data) {
  return assign({ pitch: pitch, duration: dur || 1 }, data)
}

/**
 * Create a musical structure where elements are seqenetial
 *
 * @param {Array} elements - an array of elements
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
 * @param {Object} score - the score to transform
 * @param {*} ctx - an additional object passed to transform functions
 * @return {*} the result of the transformation
 */
function transform (nt, st, pt, obj, ctx) {
  if (arguments.length > 3) return transform(nt, st, pt)(obj, ctx)

  var T = function (obj, ctx) {
    switch (typeOf(obj)) {
      case 'el': return nt(obj, ctx)
      case 'seq': return st(obj.slice(1).map(T), ctx)
      case 'sim': return pt(obj.slice(1).map(T), ctx)
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
function map (fn, obj, ctx) {
  if (arguments.length > 1) return map(fn)(obj, ctx)
  return transform(fn, buildSeq, buildSim)
}
function buildSeq (el, ctx) { return seq(el) }
function buildSim (el, ctx) { return sim(el) }

module.exports = {
  el: el, note: note,
  seq: seq, sequentially: seq,
  sim: sim, simultaneosly: sim,
  transform: transform, map: map }
