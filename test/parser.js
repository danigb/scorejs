var vows = require('vows');
var assert = require('assert');
var _ = require('lodash');

var parse = require('../lib/parser.js');
var time = require('../lib/time.js')("4/4");
var measure = time.measure;

vows.describe('Parser').addBatch({
  "parse events": function() {
    var seq = parse(time, "a b c d e f g a");
    seq.forEach(function(e) {
      assert.equal(e.duration, 1 * time.beat);
    });
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
      var p = parse(time, "A (B C) |");
      assert.equal(p.length, 3);
      assert.equal(p[0].duration, 0.5 * time.measure);
      assert.equal(p[1].duration, 0.25 * time.measure);
      assert.equal(p[1].position, 0.50 * time.measure);
      assert.equal(p[2].duration, 0.25 * time.measure);
      assert.equal(p[2].position, 0.75 * time.measure);
    }
  }
}).export(module);
