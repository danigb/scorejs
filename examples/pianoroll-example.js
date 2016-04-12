var score = require('..')
var pianoRoll = require('../ext/pianoroll')

function canvas (w, h) {
  var canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  document.body.appendChild(canvas)
  return canvas.getContext('2d')
}

pianoRoll.draw(canvas(200, 200), score(
  ['melody', '4/4', 'c2 d2 e2 (f2 g2) | a2 b2 | c3']
))
pianoRoll.draw(canvas(200, 200), score(
  ['$melo', ['phrase', 'c2 d2 e2 g2', 1]],
  ['seq', '$melo', ['sim', '$melo', ['trans', 'M3', '$melo']]]
))
pianoRoll.draw(canvas(200, 200), score(
  ['harmony', '4/4', 'Cmaj7 | Dm7 Gdom | Cmaj79']
))
