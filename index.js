'use strict'

var score = require('./lib/builder').init(
  require('./lib/score'),
  require('./lib/notes'),
  require('./lib/timed'),
  require('./lib/rhythm'),
  require('./lib/measures'),
  require('./lib/harmony')
)

if (typeof module === 'object' && module.exports) module.exports = score
if (typeof window !== 'undefined') window.Score = score
