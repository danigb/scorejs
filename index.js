'use strict'

var score = require('./lib/builder')()
score.use(
  require('./lib/score'),
  require('./lib/notes'),
  require('./lib/timed'),
  require('./lib/rhythm'),
  require('./lib/measures')
)

if (typeof module === 'object' && module.exports) module.exports = score
if (typeof window !== 'undefined') window.Score = score
