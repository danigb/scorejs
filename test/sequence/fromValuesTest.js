var test = require('../test')
var values = require('../../lib/sequence/fromValues')

test.describe('sequence/fromValues', {
  'values sequence': function () {
    test.pluckEqual(values('a b c'), 'value', ['a', 'b', 'c'])
    test.pluckEqual(values('a b c'), 'duration', [0.25, 0.25, 0.25])
    test.pluckEqual(values('a b c'), 'position', [0, 0.25, 0.50])
  }
}).export(module)
