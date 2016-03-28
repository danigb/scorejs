'use strict'

var score = require('./core/score')
require('./core/map')(score)
require('./core/forEachTime')(score)
require('./core/events')(score)

if (typeof module === 'object' && module.exports) module.exports = score
if (typeof window !== 'undefined') window.Score = score
