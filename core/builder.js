'use strict'

module.exports = function (Score) {
  Score.build = function (obj) {
    var score = {}

    score.parts = buildParts(Score, obj.parts)
    merge(score, obj, 'parts')
    return score
  }
}

function buildParts (Score, parts) {
  var parsed = {}
  Object.keys(parts).forEach(function (name) {
    var part = parts[name]
    if (typeof part === 'string') {
      parsed[name] = Score(part)
    } else {
      var source = part.score
      var options = merge({}, part, 'score')
      parsed[name] = Score(source, options)
    }
  })
  return parsed
}

function merge (dest, src, skip) {
  for (var n in src) {
    if (n !== skip) {
      dest[n] = src[n]
    }
  }
  return dest
}
