var vows = require('vows')
var test = require('assert')
var _ = require('lodash')

test.describe = function (name, batch) {
  return vows.describe(name).addBatch(batch)
}

test.pluckEqual = function (objects, prop, values) {
  test.deepEqual(_.pluck(objects, prop), values)
}

test._ = _

module.exports = test
