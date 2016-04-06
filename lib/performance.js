var score = require('./score')

var inst = score.map(function (note, name) {
  return score.el(note, { inst: name })
})

var tempo = score.map(function (note, tempo) {
  var c = 60 / tempo
  return score.el(note, { duration: c * note.duration })
})

var vel = score.map(function (note, vel) {
  return score.el(note, { velocity: vel })
})

module.exports = { inst: inst, tempo: tempo, vel: vel }
