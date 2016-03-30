var score = require('./score')

var inst = score.map(function (note, name) {
  return score.el(note, { inst: name })
})

module.exports = { inst: inst }
