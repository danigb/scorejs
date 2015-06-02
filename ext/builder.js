'use strict'

module.exports = function (Score) {
  Score.build = function (score) {
    var scores = Object.keys(score).map(function (name) {
      var part = score[name]
      if (typeof part === 'string') {
        return Score(part)
      } else {
        var source = part.score
        delete part.score
        return Score(source, part)
      }
    })
    return Score.merge.apply(null, scores)
  }
}
