var test = require('./support/test-helper.js');
var chord = require('../lib/chord.js');

test.describe('chord', {
  "Cmaj7": function() {
    var c = chord('CM');

    test.eq(c.name, 'CM');
    test.eq(c.notes().toString(), 'c4 e4 g4');
  }
}).export(module);
