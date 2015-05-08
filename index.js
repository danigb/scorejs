'use strict';


var Score = require('./lib/score.js')(
  require('./lib/plugins/time.js'),
  require('./lib/plugins/combine.js'),
  require('./lib/plugins/parse-music.js'),
  require('./lib/plugins/pitch.js'),
  require('./lib/plugins/chords.js')
);

module.exports = Score;

if (typeof window !== 'undefined') window.Score = Score;
