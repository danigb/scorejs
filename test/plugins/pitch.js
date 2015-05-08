var vows = require('vows');
var assert = require('assert');

var score = require('../../lib/score.js')();
score.addPlugin(require('../../lib/plugins/parse-music.js'));
score.addPlugin(require('../../lib/plugins/pitch.js'));

vows.describe('Pitch').addBatch({
  "transpose notes": function() {
    var s = score('a2 b2 c3 d3').transpose('M2');
    assert.equal(s.toString(), 'b2 c#3 d3 e3');
  }
}).export(module);
