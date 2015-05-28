vows = require('vows');
assert = require('assert');
_ = require('lodash');

Score = require('../');
Score.use(require('../ext/builder.js'));

vows.describe('Score builder').addBatch({
  "builder without transformation": function() {
    s = Score.build({
      melody: 'e b |',
      chords: 'C G |'
    });
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['e', 'C', 'b', 'G']);
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.5, 0.5]);
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.5, 0.5, 0.5, 0.5]);
  },
  "builder with transformation": function() {
    s = Score.build({
      melody: {
        score: 'e b |',
        transpose: 'M2'
      },
      chords: {
        score: 'C G |'
      }
    });
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['f#2', 'C', 'c#3', 'G']);
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.5, 0.5]);
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.5, 0.5, 0.5, 0.5]);
  }
}).export(module);
