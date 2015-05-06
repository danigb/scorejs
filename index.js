'use strict';


var Score = require('./lib/score.js');
Score.plugins(
  require('./lib/plugins/time.js'),
  require('./lib/plugins/teoria.js'),
  require('./lib/plugins/chord-player.js')
);

module.exports = Score;

if (typeof window !== 'undefined') window.Score = Score;
