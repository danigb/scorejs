var test = require('./support/test-helper.js');
var parse = require('../lib/parser.js');
var time = require('../lib/time.js')("4/4");


test.describe('Parser', {
  "parse notes": {
    "are they notes?": function() {
      ['c', 'ab8', 'r1+2+4g8', 'd#8','e8/3'].forEach(function(p) {
        test.eq(parse.isNotes(p), true, "Pattern: " + p);
      });
      ['D', 'Cmaj7', 'act of music'].forEach(function(p) {
        test.eq(parse.isNotes(p), false, "Pattern: " + p);
      });
    },
    "parse durations": function() {
      var e = parse(time, 'a2 b4 c8 e16');
      test.eq(e.length, 4);
      test.eqSeq('value', e, ['a', 'b', 'c', 'e']);
      test.eqSeq('dur', e, [192, 96, 48, 24]);
    },
    "default duration is 4": function() {
      var e = parse(time, 'a b c d');
      test.eq(e.length, 4);
      test.eqSeq('dur', e, [96, 96, 96, 96]);
    }
  },
  "parse measures": {
    "parse chords": function() {
      var e = parse(time, 'C | Dm G');
      test.eq(e.length, 3);
      test.eqSeq('value', e, ['C', 'Dm', 'G']);
      test.eqSeq('dur', e, [384, 192, 192]);
    }
  },
  "parse null return empty": function() {
    var e = parse(time, null);
    test.eq(e.length, 0);
  }
}).export(module);
