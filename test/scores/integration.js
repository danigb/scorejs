var vows = require('vows');
var assert = require('assert');
var Score = require('../../index.js');


vows.describe('Scores integration tests').addBatch({
  "chords score": function() {
    run(require('./chords.json'));
  }
}).export(module);

function run(test) {
  var parts = test.score.parts || {};
  delete test.score.parts;
  var score = Score(test.score);

  for(name in parts) {
    score.part(name, parts[name]);
  }

}
