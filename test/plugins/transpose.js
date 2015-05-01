var test = require('../support/test-helper.js');
var $ = require('../../lib/seq.js');
var scale = require('../../lib/scale.js');

$.fn.transpose = require('../../lib/plugins/transpose');

test.describe('Transpose plugin', {
  "transpose scale": function() {
    var s = $(scale('C major')).transpose('P5');
    test.eq(s.toString(), "g2 a2 b2 c3 d3 e3 f#3");
  }
}).export(module);
