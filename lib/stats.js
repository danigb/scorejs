/** @module stats */
var score = require('./score')

function dur (obj) { return obj.duration }
function one () { return 1 }
function arrayMax (arr) { return Math.max.apply(null, arr) }
function arrayAdd (arr) { return arr.reduce(function (a, b) { return a + b }) }

/**
 * Get the total duration of a score
 * @function
 */
var duration = score.transform(dur, arrayAdd, arrayMax, null)

/**
 * Get the longest element duration of a score
 * @function
 */
var longest = score.transform(dur, arrayMax, arrayMax, null)

/**
 * Return the number of elements of a score
 */
var count = score.transform(one, arrayAdd, arrayAdd, null)

module.exports = { duration: duration, longest: longest, count: count }
