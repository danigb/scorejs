var score = require('./score')

function measures (meter, measures) {
  var list
  var seq = []
  splitMeasures(measures).forEach(function (measure) {
    measure = measure.trim()
    if (measure.length > 0) {
      list = parenthesize(tokenize(measure), [])
      processList(seq, list, measureLength(meter))
    }
  })
  return score.seq(seq)
}

function measureLength (meter) {
  return 4
}

function processList (seq, list, total) {
  var dur = total / list.length
  list.forEach(function (i) {
    if (Array.isArray(i)) processList(seq, i, dur)
    else seq.push(score.note(i, dur))
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
