'use strict'

var slice = Array.prototype.slice
var modules = [
  require('./lib/score'),
  require('./lib/notes'),
  require('./lib/timed'),
  require('./lib/rhythm'),
  require('./lib/measures'),
  require('./lib/harmony'),
  require('./lib/performance'),
  require('./lib/build')
]

function score (data) {
  if (arguments.length > 1) data = score.sim(slice.call(arguments))
  return score.build(score, data).score
}

modules.forEach(function (module) {
  Object.keys(module).forEach(function (name) { score[name] = module[name] })
})

if (typeof module === 'object' && module.exports) module.exports = score
if (typeof window !== 'undefined') window.Score = score
