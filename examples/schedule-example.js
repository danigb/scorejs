/* global AudioContext */
var score = require('..')
var dm = require('./dm')
var scheduler = require('../ext/scheduler')

var ac = new AudioContext()
var s = score(
  ['inst', 'hihat', ['measures', '4/4', 'a b c d']],
  ['inst', 'clave', ['measures', '4/4', 'a (_ c) d (_ f g)']]
)
console.log(s)

scheduler.schedule(ac, 0, score.events(s), function (time, note) {
  if (note.pitch !== '_') dm[note.inst](ac, time)
})
