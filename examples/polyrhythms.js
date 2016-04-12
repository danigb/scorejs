var score = require('..')
var pianoroll = require('../ext/pianoroll')

var p1 = score(
  ['pattern', 'x..', 4],
  ['pattern', 'y..', 4]
)

score.forEachTime(console.log)

pianoroll.draw(pianoroll.canvas(), p1)
