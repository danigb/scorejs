'use strict'

module.exports = function (score) {
  score.events = function (obj) {
    var e = []
    score.forEachTime(function (time, obj) {
      e.push([time, obj])
    }, obj)
    return e.sort(function (a, b) { return a[0] - b[0] })
  }
}
