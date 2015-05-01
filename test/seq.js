var test = require('./support/test-helper.js');
var seq = require('../lib/seq.js');
var scale = require('../lib/scale.js');

test.describe('Sequence', {
  "Sequence a scale": function() {
    var s = seq(scale('G major'))
    test.eq(s.toString(), "g2 a2 b2 c3 d3 e3 f#3");
  }
}).export(module);
