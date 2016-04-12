// https://dev.opera.com/articles/drum-sounds-webaudio/
// http://joesul.li/van/synthesizing-hi-hats/

var dm = {}

function noiseBuffer (ac) {
  var bufferSize = ac.sampleRate
  var buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  var output = buffer.getChannelData(0)

  for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1
  }
  return buffer
}

dm.clave = function (ac, when) {
  var gain = ac.createGain()
  // Define the volume envelope
  gain.gain.setValueAtTime(0.00001, when)
  gain.gain.exponentialRampToValueAtTime(1, when + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.3, when + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.00001, when + 0.3)
  gain.connect(ac.destination)

  var osc = ac.createOscillator()
  osc.type = 'square'
  osc.frequency.value = 440
  osc.connect(gain)
  osc.start(when)
  osc.stop(when + 0.3)
}

dm.snare = function (ac, when) {
  var noise = ac.createBufferSource()
  noise.buffer = noiseBuffer(ac)
  var noiseFilter = ac.createBiquadFilter()
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.value = 800
  noise.connect(noiseFilter)
  var noiseEnvelope = ac.createGain()
  noiseFilter.connect(noiseEnvelope)

  noiseEnvelope.connect(ac.destination)
  var osc = ac.createOscillator()
  osc.type = 'triangle'

  var oscEnvelope = ac.createGain()
  osc.connect(oscEnvelope)
  oscEnvelope.connect(ac.destination)
  noiseEnvelope.gain.setValueAtTime(1, when)
  noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, when + 0.2)
  noise.start(when)

  osc.frequency.setValueAtTime(100, when)
  oscEnvelope.gain.setValueAtTime(0.7, when)
  oscEnvelope.gain.exponentialRampToValueAtTime(0.01, when + 0.1)
  osc.start(when)

  osc.stop(when + 0.2)
  noise.stop(when + 0.2)
}

dm.hihat = function (ac, when, duration) {
  var fundamental = 40
  var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21]
  var gain = ac.createGain()

  // Bandpass
  var bandpass = ac.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 10000

  // Highpass
  var highpass = ac.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 7000

  // Connect the graph
  bandpass.connect(highpass)
  highpass.connect(gain)
  gain.connect(ac.destination)

  // Create the oscillators
  ratios.forEach(function (ratio) {
    var osc = ac.createOscillator()
    osc.type = 'square'
    // Frequency is the fundamental * this oscillator's ratio
    osc.frequency.value = fundamental * ratio
    osc.connect(bandpass)
    osc.start(when)
    osc.stop(when + 0.3)
  })

  // Define the volume envelope
  gain.gain.setValueAtTime(0.00001, when)
  gain.gain.exponentialRampToValueAtTime(1, when + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.3, when + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.00001, when + 0.3)
}

module.exports = dm
