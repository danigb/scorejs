var vows = require('vows');
var assert = require('assert');
var Score = require('../../index.js');


vows.describe('Scores integration tests').addBatch({
  "chords score": function() {
    run(require('./chords.json'));
  }
}).export(module);

function run(test) {
  var score = prepare(test.score);
  check(score, test.expected);
}

function prepare(options) {
  var parts = getParts(options);
  var score = Score(options);

  for(name in parts) {
    score.part(name, parts[name]);
  }
  return score;
}

function check(score, expected) {
  var parts = getParts(expected);

  for(name in parts) {
    var expected = parts[name];
    var actual = score.part(name);
    var repr = actual.events.map(function(evt) {
      return [evt.value.toString(), evt.position, evt.duration, evt.type];
    });
    assert.deepEqual(repr, expected);
  }
}

function getParts(obj) {
  var parts = obj.parts || {};
  delete obj.parts;
  return parts;
}
