var t = require('../test')
var measures = require('../../lib/sequence/fromMeasures')

t.describe('sequence/fromMeasures', {
  'parse measures simple': function () {
    t.pluckEqual(measures('a b | c'), 'value', ['a', 'b', 'c'], 'values')
    t.pluckEqual(measures('a b | c'), 'duration', [0.5, 0.5, 1], 'duration')
    t.pluckEqual(measures('a b | c'), 'position', [0, 0.5, 1], 'duration')
  }
}).export(module)
