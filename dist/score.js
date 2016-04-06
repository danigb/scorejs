(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

var score = require('./lib/builder').init(
  require('./lib/score'),
  require('./lib/notes'),
  require('./lib/timed'),
  require('./lib/rhythm'),
  require('./lib/measures'),
  require('./lib/harmony')
)

if (typeof module === 'object' && module.exports) module.exports = score
if (typeof window !== 'undefined') window.Score = score

},{"./lib/builder":2,"./lib/harmony":3,"./lib/measures":4,"./lib/notes":5,"./lib/rhythm":6,"./lib/score":7,"./lib/timed":8}],2:[function(require,module,exports){
var slice = Array.prototype.slice

function init () {
  var modules = slice.call(arguments)

  var build = function (data) {
    if (arguments.length > 1) data = build['sim'](slice.call(arguments))
    return exec({}, build, data)
  }

  build.score = build
  modules.forEach(function (m) { Object.assign(build, m) })
  return build
}

var VAR = { type: 'var' }
function exec (ctx, fns, data) {
  var elements, params
  var fnName = data[0]
  var fn = fns[fnName]

  if (fnName[0] === '$') {
    ctx[fnName] = exec(ctx, fns, data[1])
    return VAR
  } else if (!fn) {
    throw Error('Command not found: "' + fnName + '"')
  } else {
    elements = data.slice(1)
    params = elements.map(function (p) {
      return Array.isArray(p) ? exec(ctx, fns, p)
       : (p[0] === '$') ? ctx[p]
       : p
    }).filter(function (p) { return p !== VAR })
    return fn.apply(null, params)
  }
}

module.exports = { init: init }

},{}],3:[function(require,module,exports){
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
})

/**
 * Create a harmony sequence
 */
function harmony (meter, data) {
  return expandChords(chords(meter, data))
}

module.exports = { chords: chords, expandChords: expandChords, harmony: harmony }

},{"./measures":4,"./score":7,"chord-dictionary":10}],4:[function(require,module,exports){
var score = require('./score')

/**
 * Parse masures using a time meter to get a sequence
 *
 * @param {String} meter - the time meter
 * @param {String} measures - the measures string
 * @param {Function} builder - (Optional) the function used to build the notes
 * @return {Score} the score object
 *
 * @example
 * measures('4/4', 'c d (e f) | g | (a b c) d')
 */
function measures (meter, measures, builder) {
  var list
  var mLen = measureLength(meter)
  if (!mLen) throw Error('Not valid meter: ' + meter)

  var seq = []
  builder = builder || score.note
  splitMeasures(measures).forEach(function (measure) {
    measure = measure.trim()
    if (measure.length > 0) {
      list = parenthesize(tokenize(measure), [])
      processList(seq, list, measureLength(meter), builder)
    }
  })
  return score.seq(seq)
}

function measureLength (meter) {
  return 4
}

function processList (seq, list, total, builder) {
  var dur = total / list.length
  list.forEach(function (i) {
    if (Array.isArray(i)) processList(seq, i, dur, builder)
    else seq.push(builder(dur, i))
  })
}

function splitMeasures (repr) {
  return repr
    .replace(/\s+\||\|\s+/, '|') // spaces between |
    .replace(/^\||\|\s*$/g, '') // first and last |
    .split('|')
}

/*
 * The following code is copied from https://github.com/maryrosecook/littlelisp
 * See: http://maryrosecook.com/blog/post/little-lisp-interpreter
 * Thanks Mary Rose Cook!
 */
var parenthesize = function (input, list) {
  var token = input.shift()
  if (token === undefined) {
    return list
  } else if (token === '(') {
    list.push(parenthesize(input, []))
    return parenthesize(input, list)
  } else if (token === ')') {
    return list
  } else {
    return parenthesize(input, list.concat(token))
  }
}

var tokenize = function (input) {
  return input
    .replace(/[\(]/g, ' ( ')
    .replace(/[\)]/g, ' ) ')
    .replace(/\,/g, ' ')
    .trim().split(/\s+/)
}

module.exports = { measures: measures, melody: measures }

},{"./score":7}],5:[function(require,module,exports){
var score = require('./score')
var tr = require('note-transposer')

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

/**
 * Transpose notes
 *
 * @param {String} interval - the interval to transpose
 * @param {Object} score - the score object
 * @return {Score} the score with the notes transposed
 */
function trans (interval, obj) {
  if (arguments.length > 1) return trans(interval)(obj)
  return score.map(function (note) {
    return note.pitch ? score.el(note, { pitch: tr(interval, note.pitch) })
      : note
  })
}

module.exports = { phrase: phrase, chord: chord, trans: trans }

},{"./score":7,"note-transposer":17}],6:[function(require,module,exports){
var score = require('./score')

/**
 * @module rhythm
 */
var rhythm = {}

/**
 * Create a rhythmic sequence from a pattern
 */
rhythm.pattern = function (pattern) {
  return score.seq(pattern.split('').map(score.note(1)))
}

/**
 * Create a rhythmic sequence from an inter onset interval number
 */
rhythm.ioi = function (ioi) {
  return rhythm.pattern(rhythm.ioiToPattern(ioi))
}

/**
 * Convert an [inter onset interval](https://en.wikipedia.org/wiki/Time_point#Interonset_interval)
 * to a pattern
 *
 * @param {String} ioi - the inter onset interval
 * @param {String} the rhythm pattern
 */
rhythm.ioiToPattern = function (num) {
  return num.split('').map(function (n) {
    return 'x' + Array(+n).join('.')
  }).join('')
}

/**
 * Convert a pattern string to inter onset interval string
 *
 * @param {String} pattern - the pattern to be converted
 * @return {String} the inter onset interval
 */
rhythm.patternToIoi = function (pattern) {
  return pattern.split(/x/)
    .map(function (d) { return d.length })
    .filter(function (_, i) { return i }) // remove first
    .map(function (d) { return d + 1 })
    .join('')
}

module.exports = rhythm

},{"./score":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var score = require('./score')

/**
* Get all notes for side-effects
*
* __Important:__ ascending time ordered is not guaranteed
*
* @param {Function} fn - the function
* @param {Score} score - the score object
* @param {Object} ctx - (Optional) a context object passed to the function
*/
function forEachTime (fn, obj, ctx) {
  if (arguments.length > 1) return forEachTime(fn)(obj, ctx)
  return function (obj, ctx) {
    return score.transform(
      function (note) {
        return function (time, ctx) {
          fn(time, note, ctx)
          return note.duration
        }
      },
      function (seq) {
        return function (time, ctx) {
          return seq.reduce(function (dur, fn) {
            return dur + fn(time + dur, ctx)
          }, 0)
        }
      },
      function (par) {
        return function (time, ctx) {
          return par.reduce(function (max, fn) {
            return Math.max(max, fn(time, ctx))
          }, 0)
        }
      }
    )(obj)(0, ctx)
  }
}

/**
 * Get a sorted events array from a score
 *
 */
function events (obj, build, compare) {
  var e = []
  forEachTime(function (time, obj) {
    e.push(build ? build(time, obj) : [time, obj])
  }, obj)
  return e.sort(compare || function (a, b) { return a[0] - b[0] })
}

module.exports = { forEachTime: forEachTime, events: events }

},{"./score":7}],9:[function(require,module,exports){
module.exports={
  "4": [ "1 4 7b 10m", [ "quartal" ] ],
  "5": [ "1 5" ],

  "M": [ "1 3 5", [ "Major", "" ] ],
  "M#5": [ "1 3 5A", [ "augmented", "maj#5", "Maj#5", "+", "aug" ] ],
  "M#5add9": [ "1 3 5A 9", [ "+add9" ] ],
  "M13": [ "1 3 5 7 9 13", [ "maj13", "Maj13" ] ],
  "M13#11": [ "1 3 5 7 9 11# 13", [ "maj13#11", "Maj13#11", "M13+4", "M13#4" ] ],
  "M6": [ "1 3 5 13", [ "6" ] ],
  "M6#11": [ "1 3 5 6 11#", [ "M6b5", "6#11", "6b5" ] ],
  "M69": [ "1 3 5 6 9", [ "69" ] ],
  "M69#11": [ "1 3 5 6 9 11#" ],
  "M7#11": [ "1 3 5 7 11#", [ "maj7#11", "Maj7#11", "M7+4", "M7#4" ] ],
  "M7#5": [ "1 3 5A 7", [ "maj7#5", "Maj7#5", "maj9#5", "M7+" ] ],
  "M7#5sus4": [ "1 4 5A 7" ],
  "M7#9#11": [ "1 3 5 7 9# 11#" ],
  "M7add13": [ "1 3 5 6 7 9" ],
  "M7b5": [ "1 3 5d 7" ],
  "M7b6": [ "1 3 6b 7" ],
  "M7b9": [ "1 3 5 7 9b" ],
  "M7sus4": [ "1 4 5 7" ],
  "M9": [ "1 3 5 7 9", [ "maj9", "Maj9" ] ],
  "M9#11": [ "1 3 5 7 9 11#", [ "maj9#11", "Maj9#11", "M9+4", "M9#4" ] ],
  "M9#5": [ "1 3 5A 7 9", [ "Maj9#5" ] ],
  "M9#5sus4": [ "1 4 5A 7 9" ],
  "M9b5": [ "1 3 5d 7 9" ],
  "M9sus4": [ "1 4 5 7 9" ],
  "Madd9": [ "1 3 5 9", [ "2", "add9", "add2" ] ],
  "Maj7": [ "1 3 5 7", [ "maj7", "M7" ] ],
  "Mb5": [ "1 3 5d" ],
  "Mb6": [ "1 3 13b" ],
  "Msus2": [ "1 2M 5", [ "add9no3", "sus2" ] ],
  "Msus4": [ "1 4 5", [ "sus", "sus4" ] ],
  "addb9": [ "1 3 5 9b" ],
  "7": [ "1 3 5 7b", [ "Dominant", "Dom" ] ],
  "9": [ "1 3 5 7b 9", [ "79" ] ],
  "11": [ "1 5 7b 9 11" ],
  "13": [ "1 3 5 7b 9 13", [ "13_" ] ],
  "11b9": [ "1 5 7b 9b 11" ],
  "13#11": [ "1 3 5 7b 9 11# 13", [ "13+4", "13#4" ] ],
  "13#9": [ "1 3 5 7b 9# 13", [ "13#9_" ] ],
  "13#9#11": [ "1 3 5 7b 9# 11# 13" ],
  "13b5": [ "1 3 5d 6 7b 9" ],
  "13b9": [ "1 3 5 7b 9b 13" ],
  "13b9#11": [ "1 3 5 7b 9b 11# 13" ],
  "13no5": [ "1 3 7b 9 13" ],
  "13sus4": [ "1 4 5 7b 9 13", [ "13sus" ] ],
  "69#11": [ "1 3 5 6 9 11#" ],
  "7#11": [ "1 3 5 7b 11#", [ "7+4", "7#4", "7#11_", "7#4_" ] ],
  "7#11b13": [ "1 3 5 7b 11# 13b", [ "7b5b13" ] ],
  "7#5": [ "1 3 5A 7b", [ "+7", "7aug", "aug7" ] ],
  "7#5#9": [ "1 3 5A 7b 9#", [ "7alt", "7#5#9_", "7#9b13_" ] ],
  "7#5b9": [ "1 3 5A 7b 9b" ],
  "7#5b9#11": [ "1 3 5A 7b 9b 11#" ],
  "7#5sus4": [ "1 4 5A 7b" ],
  "7#9": [ "1 3 5 7b 9#", [ "7#9_" ] ],
  "7#9#11": [ "1 3 5 7b 9# 11#", [ "7b5#9" ] ],
  "7#9#11b13": [ "1 3 5 7b 9# 11# 13b" ],
  "7#9b13": [ "1 3 5 7b 9# 13b" ],
  "7add6": [ "1 3 5 7b 13", [ "67", "7add13" ] ],
  "7b13": [ "1 3 7b 13b" ],
  "7b5": [ "1 3 5d 7b" ],
  "7b6": [ "1 3 5 6b 7b" ],
  "7b9": [ "1 3 5 7b 9b" ],
  "7b9#11": [ "1 3 5 7b 9b 11#", [ "7b5b9" ] ],
  "7b9#9": [ "1 3 5 7b 9b 9#" ],
  "7b9b13": [ "1 3 5 7b 9b 13b" ],
  "7b9b13#11": [ "1 3 5 7b 9b 11# 13b", [ "7b9#11b13", "7b5b9b13" ] ],
  "7no5": [ "1 3 7b" ],
  "7sus4": [ "1 4 5 7b", [ "7sus" ] ],
  "7sus4b9": [ "1 4 5 7b 9b", [ "susb9", "7susb9", "7b9sus", "7b9sus4", "phryg" ] ],
  "7sus4b9b13": [ "1 4 5 7b 9b 13b", [ "7b9b13sus4" ] ],
  "9#11": [ "1 3 5 7b 9 11#", [ "9+4", "9#4", "9#11_", "9#4_" ] ],
  "9#11b13": [ "1 3 5 7b 9 11# 13b", [ "9b5b13" ] ],
  "9#5": [ "1 3 5A 7b 9", [ "9+" ] ],
  "9#5#11": [ "1 3 5A 7b 9 11#" ],
  "9b13": [ "1 3 7b 9 13b" ],
  "9b5": [ "1 3 5d 7b 9" ],
  "9no5": [ "1 3 7b 9" ],
  "9sus4": [ "1 4 5 7b 9", [ "9sus" ] ],
  "m": [ "1 3b 5", [ "minor" ] ],
  "m#5": [ "1 3b 5A", [ "m+", "mb6" ] ],
  "m11": [ "1 3b 5 7b 9 11", [ "_11" ] ],
  "m11#5": [ "1 3b 6b 7b 9 11" ],
  "m11b5": [ "1 3b 7b 12d 2M 4", [ "h11", "_11b5" ] ],
  "m13": [ "1 3b 5 7b 9 11 13", [ "_13" ] ],
  "m6": [ "1 3b 4 5 13", [ "_6" ] ],
  "m69": [ "1 3b 5 6 9", [ "_69" ] ],
  "m7": [ "1 3b 5 7b", [ "minor7", "_", "_7" ] ],
  "m7#5": [ "1 3b 6b 7b" ],
  "m7add11": [ "1 3b 5 7b 11", [ "m7add4" ] ],
  "m7b5": [ "1 3b 5d 7b", [ "half-diminished", "h7", "_7b5" ] ],
  "m9": [ "1 3b 5 7b 9", [ "_9" ] ],
  "m9#5": [ "1 3b 6b 7b 9" ],
  "m9b5": [ "1 3b 7b 12d 2M", [ "h9", "-9b5" ] ],
  "mMaj7": [ "1 3b 5 7", [ "mM7", "_M7" ] ],
  "mMaj7b6": [ "1 3b 5 6b 7", [ "mM7b6" ] ],
  "mM9": [ "1 3b 5 7 9", [ "mMaj9", "-M9" ] ],
  "mM9b6": [ "1 3b 5 6b 7 9", [ "mMaj9b6" ] ],
  "mb6M7": [ "1 3b 6b 7" ],
  "mb6b9": [ "1 3b 6b 9b" ],
  "o": [ "1 3b 5d", [ "mb5", "dim" ] ],
  "o7": [ "1 3b 5d 13", [ "diminished", "m6b5", "dim7" ] ],
  "o7M7": [ "1 3b 5d 6 7" ],
  "oM7": [ "1 3b 5d 7" ],
  "sus24": [ "1 2M 4 5", [ "sus4add9" ] ],
  "+add#9": [ "1 3 5A 9#" ],
  "madd4": [ "1 3b 4 5" ],
  "madd9": [ "1 3b 5 9" ]
}

},{}],10:[function(require,module,exports){
'use strict'

var chords = require('./chords.json')
var dictionary = require('music-dictionary')

/**
 * A chord dictionary. Get chord data from a chord name.
 *
 * @name chord
 * @function
 * @param {String} name - the chord name
 * @see music-dictionary
 *
 * @example
 * // get chord data
 * var chord = require('chord-dictionary')
 * chord('Maj7') // => { name: 'Maj7', aliases: ['M7', 'maj7']
 *                //      intervals:  [ ...],
 *                //      binary: '100010010001', decimal: 2193 }
 *
 * @example
 * // get it from aliases, binary or decimal numbers
 * chord('Maj7') === chord('M7') === chord('100010010001') === chord(2913)
 *
 * @example
 * // get chord names
 * chord.names // => ['Maj7', 'm7', ...]
 */
module.exports = dictionary(chords)

},{"./chords.json":9,"music-dictionary":11}],11:[function(require,module,exports){
'use strict'

var parse = require('music-notation/interval/parse')
var R = require('music-notation/note/regex')
var transpose = require('note-transposer')

/**
 * Create a musical dictionary. A musical dictionary is a function that given
 * a name (and optionally a tonic) returns an array of notes.
 *
 * A dictionary is created from a HashMap. It maps a name to a string with
 * an interval list and, optionally, an alternative name list (see example)
 *
 * Additionally, the dictionary has properties (see examples):
 *
 * - data: a hash with the dictionary data
 * - names: an array with all the names
 * - aliases: an array with all the names including aliases
 * - source: the source of the dictionary
 *
 * Each value of the data hash have the following properties:
 *
 * - name: the name
 * - aliases: an array with the alternative names
 * - intervals: an array with the intervals
 * - steps: an array with the intervals in __array notation__
 * - binary: a binary representation of the set
 * - decimal: the decimal representation of the set
 *
 * @name dictionary
 * @function
 * @param {Hash} source - the dictionary source
 * @return {Function} the dictionary
 *
 * @example
 * var dictionary = require('music-dictionary')
 * var chords = dictionary({'Maj7': ['1 3 5 7', ['M7']], 'm7': ['1 3b 5 7b'] })
 * chords('CMaj7') // => ['C', 'E', 'G', 'B']
 * chords('DM7') // => ['D', 'F#', 'A', 'C#']
 * chords('Bm7') // => ['B', 'D', 'F#', 'A']
 *
 * @example
 * // dictionary data
 * chords.data['M7'] // => { name: 'Maj7', aliases: ['M7'],
 *                   //      intervals: ['1', '3', '5', '7'], steps: [ ...],
 *                   //      binary: '10010010001', decimal: 2193 }
 *
 * // get chord by binary numbers
 * chords.data['100010010001'] === chords.data['Maj7']
 * chords.data[2193] === chords.data['Maj7']
 *
 * @example
 * // available names
 * chords.names // => ['Maj7', 'm7']
 * chords.aliases // => ['Maj7', 'm7', 'M7']
 */
module.exports = function (src) {
  function dict (name, tonic) {
    var v = dict.props(name)
    if (!v) {
      var n = R.exec(name)
      v = n ? dict.props(n[5]) : null
      if (!v) return []
      tonic = tonic === false ? tonic : tonic || n[1] + n[2] + n[3]
    }
    if (tonic !== false && !tonic) return function (t) { return dict(name, t) }
    return v.intervals.map(transpose(tonic))
  }
  return build(src, dict)
}

function build (src, dict) {
  var data = {}
  var names = Object.keys(src)
  var aliases = names.slice()

  dict.props = function (name) { return data[name] }
  dict.names = function (a) { return (a ? aliases : names).slice() }

  names.forEach(function (k) {
    var d = src[k]
    var c = { name: k, aliases: d[1] || [] }
    c.intervals = d[0].split(' ')
    c.steps = c.intervals.map(parse)
    c.binary = binary([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], c.steps)
    c.decimal = parseInt(c.binary, 2)
    data[k] = data[c.binary] = data[c.decimal] = c
    c.aliases.forEach(function (a) { data[a] = c })
    if (c.aliases.length > 0) aliases = aliases.concat(c.aliases)
  })
  return dict
}

function binary (num, intervals) {
  intervals.forEach(function (i) { num[(i[0] * 7 + i[1] * 12) % 12] = '1' })
  return num.join('')
}

},{"music-notation/interval/parse":13,"music-notation/note/regex":16,"note-transposer":17}],12:[function(require,module,exports){
'use strict'

// map from pitch number to number of fifths and octaves
var BASES = [ [0, 0], [2, -1], [4, -2], [-1, 1], [1, 0], [3, -1], [5, -2] ]

/**
 * Get a pitch in [array notation]() from pitch properties
 *
 * @name array.fromProps
 * @function
 * @param {Integer} step - the step index
 * @param {Integer} alterations - (Optional) the alterations number
 * @param {Integer} octave - (Optional) the octave
 * @param {Integer} duration - (Optional) duration
 * @return {Array} the pitch in array format
 *
 * @example
 * var fromProps = require('music-notation/array/from-props')
 * fromProps([0, 1, 4, 0])
 */
module.exports = function (step, alt, oct, dur) {
  var base = BASES[step]
  alt = alt || 0
  var f = base[0] + 7 * alt
  if (typeof oct === 'undefined') return [f]
  var o = oct + base[1] - 4 * alt
  if (typeof dur === 'undefined') return [f, o]
  else return [f, o, dur]
}

},{}],13:[function(require,module,exports){
'use strict'

var memoize = require('../memoize')
var fromProps = require('../array/from-props')
var INTERVAL = require('./regex')
var TYPES = 'PMMPPMM'
var QALT = {
  P: { dddd: -4, ddd: -3, dd: -2, d: -1, P: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 },
  M: { ddd: -4, dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 }
}

/**
 * Parse a [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * to [interval coord notation](https://github.com/danigb/music.array.notation)
 *
 * This function is cached for better performance.
 *
 * @name interval.parse
 * @function
 * @param {String} interval - the interval string
 * @return {Array} the interval in array notation or null if not a valid interval
 *
 * @example
 * var parse = require('music-notation/interval/parse')
 * parse('3m') // => [2, -1, 0]
 * parse('9b') // => [1, -1, 1]
 * parse('-2M') // => [6, -1, -1]
 */
module.exports = memoize(function (str) {
  var m = INTERVAL.exec(str)
  if (!m) return null
  var dir = (m[2] || m[7]) === '-' ? -1 : 1
  var num = +(m[3] || m[8]) - 1
  var q = m[4] || m[6] || ''

  var simple = num % 7

  var alt
  if (q === '') alt = 0
  else if (q[0] === '#') alt = q.length
  else if (q[0] === 'b') alt = -q.length
  else {
    alt = QALT[TYPES[simple]][q]
    if (typeof alt === 'undefined') return null
  }
  var oct = Math.floor(num / 7)
  var arr = fromProps(simple, alt, oct)
  return dir === 1 ? arr : [-arr[0], -arr[1]]
})

},{"../array/from-props":12,"../memoize":15,"./regex":14}],14:[function(require,module,exports){

// shorthand tonal notation (with quality after number)
var TONAL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4}|b{1,4}|#{1,4}|)'
// strict shorthand notation (with quality before number)
var STRICT = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + TONAL + ')|(' + STRICT + '))'

/**
 * A regex for parse intervals in shorthand notation
 *
 * Three different shorthand notations are supported:
 *
 * - default [direction][number][quality]: the preferred style `3M`, `-5A`
 * - strict: [quality][direction][number], for example: `M3`, `A-5`
 * - altered: [direction][number][alterations]: `3`, `-5#`
 *
 * @name interval.regex
 */
module.exports = new RegExp('^' + COMPOSE + '$')

},{}],15:[function(require,module,exports){
'use strict'

/**
 * A simple and fast memoization function
 *
 * It helps creating functions that convert from string to pitch in array format.
 * Basically it does two things:
 * - ensure the function only receives strings
 * - memoize the result
 *
 * @name memoize
 * @function
 * @private
 */
module.exports = function (fn) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return (str in cache) ? cache[str] : cache[str] = fn(str)
  }
}

},{}],16:[function(require,module,exports){
'use strict'

/**
 * A regex for matching note strings in scientific notation.
 *
 * The note string should have the form `letter[accidentals][octave][/duration]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - duration: (Optional) anything follows a slash `/` is considered to be the duration
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * @name note.regex
 * @example
 * var R = require('music-notation/note/regex')
 * R.exec('c#4') // => ['c#4', 'c', '#', '4', '', '']
 */
module.exports = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)(\/\d+|)\s*(.*)\s*$/

},{}],17:[function(require,module,exports){
var parse = require('music-notation/pitch/parse')
var str = require('music-notation/pitch/str')
var operation = require('music-notation/operation')(parse, str)

/**
 * Transposes a note by an interval.
 *
 * Given a note and an interval it returns the transposed note. It can be used
 * to add intervals if both parameters are intervals.
 *
 * The order of the parameters is indifferent.
 *
 * This function is currified so it can be used to map arrays of notes.
 *
 * @name transpose
 * @function
 * @param {String|Array} interval - the interval. If its false, the note is not
 * transposed.
 * @param {String|Array} note - the note to transpose
 * @return {String|Array} the note transposed
 *
 * @example
 * var transpose = require('note-transposer')
 * transpose('3m', 'C4') // => 'Eb4'
 * transpose('C4', '3m') // => 'Eb4'
 * tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
 * ['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
 */
var transpose = operation(function (i, n) {
  if (i === false) return n
  else if (!Array.isArray(i) || !Array.isArray(n)) return null
  else if (i.length === 1 || n.length === 1) return [n[0] + i[0]]
  var d = i.length === 2 && n.length === 2 ? null : n[2] || i[2]
  return [n[0] + i[0], n[1] + i[1], d]
})

if (typeof module === 'object' && module.exports) module.exports = transpose
if (typeof window !== 'undefined') window.transpose = transpose

},{"music-notation/operation":28,"music-notation/pitch/parse":29,"music-notation/pitch/str":30}],18:[function(require,module,exports){
'use strict'

/**
 * Build an accidentals string from alteration number
 *
 * @name accidentals.str
 * @param {Integer} alteration - the alteration number
 * @return {String} the accidentals string
 *
 * @example
 * var accidentals = require('music-notation/accidentals/str')
 * accidentals(0) // => ''
 * accidentals(1) // => '#'
 * accidentals(2) // => '##'
 * accidentals(-1) // => 'b'
 * accidentals(-2) // => 'bb'
 */
module.exports = function (num) {
  if (num < 0) return Array(-num + 1).join('b')
  else if (num > 0) return Array(num + 1).join('#')
  else return ''
}

},{}],19:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],20:[function(require,module,exports){
'use strict'

// Map from number of fifths to interval number (0-index) and octave
// -1 = fourth, 0 = unison, 1 = fifth, 2 = second, 3 = sixth...
var BASES = [[3, 1], [0, 0], [4, 0], [1, -1], [5, -1], [2, -2], [6, -2], [3, -3]]

/**
 * Get properties from a pitch in array format
 *
 * The properties is an array with the form [number, alteration, octave, duration]
 *
 * @name array.toProps
 * @function
 * @param {Array} array - the pitch in coord format
 * @return {Array} the pitch in property format
 *
 * @example
 * var toProps = require('music-notation/array/to-props')
 * toProps([2, 1, 4]) // => [1, 2, 4]
 */
module.exports = function (arr) {
  if (!Array.isArray(arr)) return null
  var index = (arr[0] + 1) % 7
  if (index < 0) index = 7 + index
  var base = BASES[index]
  var alter = Math.floor((arr[0] + 1) / 7)
  var oct = arr.length === 1 ? null : arr[1] - base[1] + alter * 4
  var dur = arr[2] || null
  return [base[0], alter, oct, dur]
}

},{}],21:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"../array/from-props":19,"../memoize":24,"./regex":22,"dup":13}],22:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],23:[function(require,module,exports){
'use strict'

var props = require('../array/to-props')
var cache = {}

/**
 * Get a string with a [shorthand interval notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
 * from interval in [array notation](https://github.com/danigb/music.array.notation)
 *
 * The returned string has the form: `number + quality` where number is the interval number
 * (positive integer for ascending intervals, negative integer for descending intervals, never 0)
 * and the quality is one of: 'M', 'm', 'P', 'd', 'A' (major, minor, perfect, dimished, augmented)
 *
 * @name interval.str
 * @function
 * @param {Array} interval - the interval in array notation
 * @return {String} the interval string in shorthand notation or null if not valid interval
 *
 * @example
 * var str = require('music-notation/interval/str')
 * str([1, 0, 0]) // => '2M'
 * str([1, 0, 1]) // => '9M'
 */
module.exports = function (arr) {
  if (!Array.isArray(arr) || arr.length !== 2) return null
  var str = '|' + arr[0] + '|' + arr[1]
  return str in cache ? cache[str] : cache[str] = build(arr)
}

var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
var TYPES = 'PMMPPMM'

function build (coord) {
  var p = props(coord)
  var t = TYPES[p[0]]

  var dir, num, alt
  // if its descening, invert number
  if (p[2] < 0) {
    dir = -1
    num = (8 - p[0]) - 7 * (p[2] + 1)
    alt = t === 'P' ? -p[1] : -(p[1] + 1)
  } else {
    dir = 1
    num = p[0] + 1 + 7 * p[2]
    alt = p[1]
  }
  var q = ALTER[t][4 + alt]
  return dir * num + q
}

},{"../array/to-props":20}],24:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],25:[function(require,module,exports){
'use strict'

var memoize = require('../memoize')
var R = require('./regex')
var BASES = { C: [0, 0], D: [2, -1], E: [4, -2], F: [-1, 1], G: [1, 0], A: [3, -1], B: [5, -2] }

/**
 * Get a pitch in [array notation]()
 * from a string in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
 *
 * The string to parse must be in the form of: `letter[accidentals][octave]`
 * The accidentals can be up to four # (sharp) or b (flat) or two x (double sharps)
 *
 * This function is cached for better performance.
 *
 * @name note.parse
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the note in array notation or null if not valid note
 *
 * @example
 * var parse = require('music-notation/note/parse')
 * parse('C') // => [ 0 ]
 * parse('c#') // => [ 8 ]
 * parse('c##') // => [ 16 ]
 * parse('Cx') // => [ 16 ] (double sharp)
 * parse('Cb') // => [ -6 ]
 * parse('db') // => [ -4 ]
 * parse('G4') // => [ 2, 3, null ]
 * parse('c#3') // => [ 8, -1, null ]
 */
module.exports = memoize(function (str) {
  var m = R.exec(str)
  if (!m || m[5]) return null

  var base = BASES[m[1].toUpperCase()]
  var alt = m[2].replace(/x/g, '##').length
  if (m[2][0] === 'b') alt *= -1
  var fifths = base[0] + 7 * alt
  if (!m[3]) return [fifths]
  var oct = +m[3] + base[1] - 4 * alt
  var dur = m[4] ? +(m[4].substring(1)) : null
  return [fifths, oct, dur]
})

},{"../memoize":24,"./regex":26}],26:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],27:[function(require,module,exports){
'use strict'

var props = require('../array/to-props')
var acc = require('../accidentals/str')
var cache = {}

/**
 * Get [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) string
 * from pitch in [array notation]()
 *
 * Array length must be 1 or 3 (see array notation documentation)
 *
 * The returned string format is `letter[+ accidentals][+ octave][/duration]` where the letter
 * is always uppercase, and the accidentals, octave and duration are optional.
 *
 * This function is memoized for better perfomance.
 *
 * @name note.str
 * @function
 * @param {Array} arr - the note in array notation
 * @return {String} the note in scientific notation or null if not valid note array
 *
 * @example
 * var str = require('music-notation/note/str')
 * str([0]) // => 'F'
 * str([0, 4]) // => null (its an interval)
 * str([0, 4, null]) // => 'F4'
 * str([0, 4, 2]) // => 'F4/2'
 */
module.exports = function (arr) {
  if (!Array.isArray(arr) || arr.length < 1 || arr.length === 2) return null
  var str = '|' + arr[0] + '|' + arr[1] + '|' + arr[2]
  return str in cache ? cache[str] : cache[str] = build(arr)
}

var LETTER = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
function build (coord) {
  var p = props(coord)
  return LETTER[p[0]] + acc(p[1]) + (p[2] !== null ? p[2] : '') + (p[3] !== null ? '/' + p[3] : '')
}

},{"../accidentals/str":18,"../array/to-props":20}],28:[function(require,module,exports){
'use strict'

function curry (fn, arity) {
  if (arity === 1) return fn
  return function (a, b) {
    if (arguments.length === 1) return function (c) { return fn(a, c) }
    return fn(a, b)
  }
}

/**
 * Decorate a function to work with intervals, notes or pitches in
 * [array notation](https://github.com/danigb/tonal/tree/next/packages/music-notation)
 * with independence of string representations.
 *
 * This is the base of the pluggable notation system of
 * [tonal](https://github.com/danigb/tonal)
 *
 * @name operation
 * @function
 * @param {Function} parse - the parser
 * @param {Function} str - the string builder
 * @param {Function} fn - the operation to decorate
 *
 * @example
 * var parse = require('music-notation/interval/parse')
 * var str = require('music-notation/interval/str')
 * var operation = require('music-notation/operation')(parse, str)
 * var add = operation(function(a, b) { return [a[0] + b[0], a[1] + b[1]] })
 * add('3m', '3M') // => '5P'
 */
module.exports = function op (parse, str, fn) {
  if (arguments.length === 2) return function (f) { return op(parse, str, f) }
  return curry(function (a, b) {
    var ac = parse(a)
    var bc = parse(b)
    if (!ac && !bc) return fn(a, b)
    var v = fn(ac || a, bc || b)
    return str(v) || v
  }, fn.length)
}

},{}],29:[function(require,module,exports){
var note = require('../note/parse')
var interval = require('../interval/parse')

/**
 * Convert a note or interval string to a [pitch in coord notation]()
 *
 * @name pitch.parse
 * @function
 * @param {String} pitch - the note or interval to parse
 * @return {Array} the pitch in array notation
 *
 * @example
 * var parse = require('music-notation/pitch/parse')
 * parse('C2') // => [0, 2, null]
 * parse('5P') // => [1, 0]
 */
module.exports = function (n) { return note(n) || interval(n) }

},{"../interval/parse":21,"../note/parse":25}],30:[function(require,module,exports){
var note = require('../note/str')
var interval = require('../interval/str')

/**
 * Convert a pitch in coordinate notation to string. It deals with notes, pitch
 * classes and intervals.
 *
 * @name pitch.str
 * @funistron
 * @param {Array} pitch - the pitch in array notation
 * @return {String} the pitch string
 *
 * @example
 * var str = require('music-notation/pitch.str')
 * // pitch class
 * str([0]) // => 'C'
 * // interval
 * str([0, 0]) // => '1P'
 * // note
 * str([0, 2, 4]) // => 'C2/4'
 */
module.exports = function (n) { return note(n) || interval(n) }

},{"../interval/str":23,"../note/str":27}]},{},[1]);
