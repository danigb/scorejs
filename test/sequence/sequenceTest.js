var t = require('../test')
var sequence = require('../../lib/sequence/sequence')

t.describe('sequence', {
  'Create a sequence': function () {
    var events = [['a', 1], ['b', 1], ['c', 1]]
    t.pluckEqual(sequence(events), 'position', [0, 1, 2])
    t.pluckEqual(sequence(events), 'value', ['a', 'b', 'c'])
    t.pluckEqual(sequence(events), 'duration', [1, 1, 1])
  }
})
