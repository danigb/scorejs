var t = require('../test')
var measure = require('../../lib/duration/measure')

t.describe('duration/measure', {
  'test measure duration': function () {
    t.equal(measure('4/4'), 1)
  }
}).export(module)
