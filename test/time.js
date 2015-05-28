var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

var Score = require('../');

vows.describe('Time plugin').addBatch({
  "duration": function() {
    s = Score('a b c d e f');
    assert.equal(s.duration(), 1.5);
  },
  "delay method": function() {
    s = Score('a b').delay(100);
    assert.deepEqual(_.pluck(s.sequence, 'position'), [100, 100.25]);
  },
  "repeat method": function() {
    s = Score('a b').repeat(3);
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'b', 'a', 'b', 'a', 'b']);
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25, 0.5, 0.75, 1, 1.25]);
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.25, 0.25, 0.25, 0.25, 0.25]);
  },
  "sequence": function() {
    s = Score('a b c/8', function(event) {
      return event.value === 'b' ? null : event;
    }).compact();
    assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'c']);
    assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.125]);
    assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0.25]);
  }
}).export(module);
