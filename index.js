'use strict'

var Score = require('./score.js')()
Score.use(require('./core/time.js'))
Score.use(require('./core/select.js'))
Score.use(require('./core/notes.js'))
Score.use(require('./core/chords.js'))
Score.use(require('./core/builder.js'))

if (typeof module === 'object' && module.exports) module.exports = Score
if (typeof window !== 'undefined') window.Score = Score
