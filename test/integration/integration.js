var vows = require('vows');
var assert = require('assert');
var Score = require('../../index.js');

vows.describe("Scores integration tests").addBatch(batch([
  'chords', 'transpose', 'walking-bass'
])).export(module);

function batch(tests) {
  var batch = {};
  tests.forEach(function(name) {
    batch["integration:" + name] = function() {
      run(require('./' + name + '.json'));
    }
  });
  return batch;
}

function run(test) {
  var score = prepare(test.score);
  check(score, test.expected);
}

function prepare(options) {
  var parts = getParts(options);
  var score = Score(options);

  for(name in parts) {
    var part = parts[name];
    var proc = buildProcess(part.process);
    score.part(name, parts[name].source, proc);
  }
  return score;
}

function buildProcess(process) {
  var args;
  return function(seq) {
    for(proc in process) {
      args = process[proc];
      assert(seq[proc], "Plugin " + proc + " must exist.");
      seq = seq[proc].apply(seq, args);
    }
    return seq;
  }
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
