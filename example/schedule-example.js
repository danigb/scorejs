/* global AudioContext */
var score = require('..')
var dm = require('./dm')
var scheduler = require('../ext/scheduler')

var ac = new AudioContext()
var s = score(
  ['measures', '4/4', 'a b c d'],
  ['measures', '4/4', 'a (b c) d (e f g)']
)
console.log(s)

scheduler.schedule(ac, 0, score.events(s), function (time, note) {
  console.log('play', time, note)
  dm.hihat(ac, time)
})
