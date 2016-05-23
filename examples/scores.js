/* global AudioContext */
var soundfont = require('soundfont-player')
var score = require('..')
var ac = new AudioContext()
var tonal = require('tonal')

document.body.innerHTML = '<h1>Scores (scorejs demo)</h1>'

soundfont.instrument(ac, 'marimba').then(function (marimba) {
  var Score = score.build(Object.assign({}, score, tonal))
  var s = Score(['tempo', 120, [
    'phrase', ['range', 'c2 c4 c2'], 0.25]
  ]).score
  marimba.schedule(score.events(s), function (evt) {
    return { name: evt[1].pitch, time: evt[0] }
  })
})
