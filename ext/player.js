var timed = require('../lib/timed')
var scheduler = require('./scheduler')
var toMidi = require('note-midi')
var toFreq = require('midi-freq')

function play (ac, player, obj) {
  var e = timed.events(obj)
  scheduler.schedule(ac, 0, e, function (time, note) {
    console.log(time, note)
    var freq = toFreq(440, toMidi(note.pitch))
    if (freq) player(ac, freq, time, note.duration, note.velocity)
  })
}

function synth (ac, freq, when, dur, vel) {
  console.log('synth', freq, when, dur, vel)
  var osc = ac.createOscillator()
  var gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)

  gain.gain.value = (vel || 80) / 100
  osc.type = 'square'
  osc.frequency.value = freq || 440
  osc.start(when || 0)
  osc.stop(when + (dur || 0.5))
}

module.exports = { play: play, synth: synth }
