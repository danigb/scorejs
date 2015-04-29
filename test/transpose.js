var test = require('./support/test-helper.js');
var $ = require('../lib/score.js');
var scale = require('../lib/scale.js');
var transpose = require('../lib/plugins/transpose');

$.plugin("transpose", transpose);

test.describe('Transpose plugin', {
  "transpose scale": function() {
    var s = $(scale('C major')).transpose('P5');
    test.eq(s.str(), "g a b c d e f# g");
  }
}).export(module);
