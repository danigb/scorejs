var vows = require('vows');
var assert = require('assert');
var Score = require('../index.js');

var tests = [
  'merge', 'chords', 'transpose', 'delay'
];

vows.describe("Scores integration tests")
  .addBatch(batch(tests)).export(module);

function batch(tests) {
  var batch = {};
  tests.forEach(function(name) {
    batch["integration:" + name] = function() {
      run(require('./integration/' + name + '.json'));
    }
  });
  return batch;
}

function run(test) {
  var score = new Score(test.score);
  check(score, test.expected);
}

function check(score, expected) {
  var parts = getParts(expected);

  for(name in parts) {
    var expected = parts[name];
    var actual = score.part(name);
    var repr = actual.events.map(function(evt) {
      return [evt.str(), evt.position, evt.duration, evt.type];
    });
    assert.deepEqual(repr, expected);
  }
}

function getParts(obj) {
  var parts = obj.parts || {};
  delete obj.parts;
  return parts;
}
