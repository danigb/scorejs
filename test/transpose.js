var test = require('./support/test-helper.js');
var $ = require('../lib/score.js');
var transpose = require('../lib/plugins/transpose');

$.plugin("transpose", transpose);

test.pending('Transpose', {
  "transpose": function() {
    var s = $('a4 b4').transpose('M2');
    test.eqSeq('value', s.dest, []);
  }
}).export(module);
