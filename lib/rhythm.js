/** @module rhythm */

var score = require('./score')

var rhythm = {}

/**
 * Create a rhythmic sequence from a pattern
 */
rhythm.pattern = function (pattern, duration) {
  var arr = pattern.split('')
  var dur = duration ? duration / arr.length : 1
  return score.seq(arr.map(score.note(dur)))
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
