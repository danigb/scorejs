/* global AudioContext */

var score = require('..')
var player = require('../ext/player')
var ac = new AudioContext()

var h = score(
  ['vel', 80, ['melody', '4/4', 'c4 d4 e4 f4 | g4 a4 b4 c5 | _ . . .']],
  ['vel', 10, ['harmony', '4/4', 'Cmaj7 | Dm7 Gdom | C']]
)

player.play(ac, player.synth, score.tempo(120, h))
