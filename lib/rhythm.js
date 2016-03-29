var score = require('./score')

/**
 * @module rhythm
 */
var rhythm = {}

rhythm.pattern = function (pattern) {
  return score.seq(pattern.split('').map(score.note(1)))
}

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
  return num.split('').map((n) => 'x' + Array(+n).join('.')).join('')
}

rhythm.patternToIoi = function (pattern) {
  return pattern.split(/x/)
    .map((d) => d.length)
    .filter((_, i) => i) // remove first
    .map((d) => d + 1)
    .join('')
}

module.exports = rhythm
