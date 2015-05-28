vows = require('vows');
assert = require('assert');
_ = require('lodash');

Score = require('../');

vows.describe('Score transform').addBatch({
  "transform object": {
    "simple object transform": function() {
      s = Score('a b c', { transpose: 'M2' });
      assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'b2', 'c#3', 'd2' ]);
    },
    "multiple transformations": function() {
      s = Score('a b |', { repeat: 2, transpose: 'M3' });
      assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'c#3', 'd#3', 'c#3', 'd#3' ]);
    }
  },
  "transform function": {
    "transform method": function() {
      s = Score('a b').transform(function(event) {
        event.value = event.value.toUpperCase();
        event.duration = event.duration * 2;
        event.position = event.position + 1;
        return event;
      });
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['A', 'B']);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/2, 1/2]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [1, 1.25]);
    },
    "simple transform": function() {
      s = Score('a b', function(event) {
        event.value = event.value.toUpperCase();
        event.duration = event.duration * 2;
        event.position = event.position + 1;
        return event;
      });
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['A', 'B']);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/2, 1/2]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [1, 1.25]);
    },
    "scores are always ordered": function() {
      s = Score("a b", function(event) {
        if(event.value == 'a') event.position += 10;
        return event;
      });
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['b', 'a']);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/4, 1/4]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0.25, 10]);
    },
    "transformations are compacted": function() {
      s = Score("a b a c", function(event) {
        if(event.value !== 'a') return event;
      });
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['b', 'c']);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1/4, 1/4]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0.25, 0.75]);
    },
    "transformations are flattened": function() {
      s = Score('a b', function(event) {
        return [event, Score.event(event, { value: event.value.toUpperCase() })];
      });
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'A', 'b', 'B']);
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.25, 0.25, 0.25]);
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.25, 0.25]);
    }
  }
}).export(module);
