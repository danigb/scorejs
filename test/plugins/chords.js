var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

var score = require('../../lib/score.js')();
score.addPlugin(require('../../lib/plugins/parse-music.js'));
score.addPlugin(require('../../lib/plugins/chords.js'));

vows.describe('Pitch').addBatch({
  "teoria:chordRoots": function() {
    var s = score('Cmaj7 | Dm7 G7').roots(2);
    assert.deepEqual(_.pluck(s.events, 'position'), [0, 384, 576]);
    assert.deepEqual(_.pluck(s.events, 'duration'), [2, 2, 2]);
    assert.deepEqual(_.pluck(s.events, 'type'), ['note', 'note', 'note']);
  }
}).export(module);
