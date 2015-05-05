'use strict';

var plugins = [
  require('./lib/plugins/time.js'),
  require('./lib/plugins/teoria.js'),
  require('./lib/plugins/chord-player.js')
];

var $ = function(obj) {
}

$.Sequence = require('./lib/sequence.js')(plugins);
$.Score = require('./lib/score.js');

module.exports = $;
if (typeof window !== 'undefined') window.Score = $;
