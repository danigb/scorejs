/* global AudioContext */
var soundfont = require('soundfont-player')
var score = require('..')
var ac = new AudioContext()
var tonal = require('tonal')
var Score = score.build(Object.assign({}, score, tonal))

document.body.innerHTML = '<h1>Scores (scorejs demo)</h1>'

soundfont.instrument(ac, 'marimba').then(function (marimba) {
  var s = ttone1(4, row, 60, 0.25)
  marimba.schedule(0, score.events(s).map(function (i) {
    i[1] = i[1].pitch
    return i
  }))
})

var row = '0 1 6 7 10 11 5 4 3 9 2 8'
// Metalevel, pg 124
function ttone1 (reps, row, key, beat, amp) {
  var tr = row.split(' ').map(function (n) {
    return +n + key
  })
  var r = score.repeat(reps, score.phrase(tr, beat, amp))
  return score.map(function (e) {
    return randDur(randOct(e), beat)
  }, null, r)
}
function randDur (e, beat) {
  var offset = Math.round(Math.random() * 4) * beat / 4
  return score.el(e, { duration: e.duration + offset })
}
function randOct (e) {
  return Math.random() < 0.5
    ? score.el(e, { pitch: e.pitch + 12 })
    : score.el(e, { pitch: e.pitch - 12 })
}
