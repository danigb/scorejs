var vows = require('vows');
var assert = require('assert');

var test = function() {
  assert.equal.apply(arguments);
}

test.describe = function(name, batch) {
  return vows.describe(name).addBatch(batch);
}
test.pending = function(name, batch) {
  return vows.describe(name);
};

test.eqSeq = function(key, actual, expected, message) {
  var values = null;
  if(actual && actual.map) {
    values = actual.map(function(o) { return key ? o[key] : o; });
  }
  assert.deepEqual(values, expected, message);
}

test.eq = assert.equal;
test.dEq = assert.deepEqual;

module.exports = test;
