var vows = require('vows');
var assert = require('assert');
var parse = require('../lib/parser.js');
var time = require('../lib/time.js')("4/4");

var dEq = assert.deepEqual;
var map = function(a, key) {
  return a.map(function(o) {
    return key ? o[key] : o;
  });
}

vows.describe('Object').addBatch({
  "parse notes": {
    "are they notes?": function() {
      ['ab8', 'r1+2+4g8ab8', 'd#8e8/3'].forEach(function(p) {
        assert.equal(parse.isNotes(p), true, "Pattern: " + p);
      });
      ['D', 'Cmaj7', 'act of music'].forEach(function(p) {
        assert.equal(parse.isNotes(p), false, "Pattern: " + p);
      });
    },
    "parse simple": function() {
      var e = parse(time, 'a2 b4 c8 e16');
      assert.equal(e.length, 4);
      dEq(map(e, 'value'), ['a', 'b', 'c', 'e']);
      dEq(map(e, 'dur'), [192, 96, 48, 24]);
    }
  },
  "parse measures": {
    "parse chords": function() {
      var e = parse(time, 'C | Dm G');
      assert.equal(e.length, 3);
      dEq(map(e, 'value'), ['C', 'Dm', 'G']);
      dEq(map(e, 'dur'), [384, 192, 192]);
    }
  }
}).export(module);
