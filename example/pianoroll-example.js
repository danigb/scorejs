var score = require('..')
var pianoRoll = require('../ext/pianoroll')

function createCanvas (w, h) {
  var canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  document.body.appendChild(canvas)
  return canvas.getContext('2d')
}

pianoRoll.draw(createCanvas(200, 200), score(
  ['melody', '4/4', 'c2 d2 e2 (f2 g2) | a2 b2 | c3']
))
pianoRoll.draw(createCanvas(200, 200), score(
  ['$melo', ['phrase', 'c2 d2 e2 g2', 1]],
  ['score', '$melo', ['trans', 'M3', '$melo']]
))
