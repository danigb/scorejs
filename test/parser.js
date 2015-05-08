var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

var parse = require('../lib/parser.js');
var time = require('../lib/time.js')("4/4");
var measure = time.measure;

vows.describe('Parser').addBatch({
  "default duration is 1 beat": function() {
    var seq = parse(time, "a b c d e f g a");
    seq.forEach(function(e) {
      assert.equal(e.duration, 1 * time.beat);
    });
  },
  "parse durations": {
    "simple length": function() {
      var s = parse(time, "c/4 d/8 e/8 g/4");
      assert.equal(s.length, 4);
      var durations = _.pluck(s, 'duration');
      assert.deepEqual(durations, [96, 48, 48, 96]);
    }
  },
  "parse measures": {
    "whole measures": function() {
      var p = parse(time, "A | B");
      assert.equal(p.length, 2);
      assert.equal(p[0].duration, 1 * time.measure);
      assert.equal(p[0].position, 0);
      assert.equal(p[1].duration, 1 * time.measure);
      assert.equal(p[1].position, 1 * time.measure);
    },
    "divided measures": function() {
      var p = parse(time, "A B | C");
      assert.equal(p.length, 3);
      assert.equal(p[0].duration, 0.5 * time.measure);
      assert.equal(p[1].duration, 0.5 * time.measure);
      assert.equal(p[1].position, 0.5 * time.measure);
    },
    "one level nesting": function() {
      var s = parse(time, "A (B C) |");
      assert.equal(s.length, 3);
      var durations = _.pluck(s, 'duration');
      assert.deepEqual(durations, [192, 96, 96]);
    }
  }
}).export(module);
