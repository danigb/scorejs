var dm = {}

dm.hihat = function (context, when, duration) {
  var fundamental = 40
  var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21]
  var gain = context.createGain()

  // Bandpass
  var bandpass = context.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 10000

  // Highpass
  var highpass = context.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 7000

  // Connect the graph
  bandpass.connect(highpass)
  highpass.connect(gain)
  gain.connect(context.destination)

  // Create the oscillators
  ratios.forEach(function (ratio) {
    var osc = context.createOscillator()
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
