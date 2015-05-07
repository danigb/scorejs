'use strict';


var Score = require('./lib/score.js')(
  require('./lib/plugins/time.js'),
  require('./lib/plugins/teoria.js'),
  require('./lib/plugins/left-hand-piano.js'),
  require('./lib/plugins/walking-bass.js')
);

module.exports = Score;

if (typeof window !== 'undefined') window.Score = Score;
