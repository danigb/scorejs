var vows = require('vows');
var assert = require('assert');

var score = require('../../index.js');

vows.describe('Walking bass plugin').addBatch({
  "walkingBass method": function() {
    assert(score.fn.walkingBass);
  },
  "play bass": function() {
    var s = score('Cmaj7').leftHandPiano({instrument: 'myInstrument'});
    assert.equal(s.events.length, 4);
    s.events.forEach(function(e) {
      assert.equal(e.type, 'note');
      assert.equal(e.get('instrument'), 'myInstrument');
      assert.equal(e.get('fromChord'), 'Cmaj7');
    });
  }
}).export(module);
