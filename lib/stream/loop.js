
function * loop (values) {
  var index = 0
  var array = Array.isArray(values) ? values : [ values ]
  var len = array.length
  while (true) {
    yield array[index]
    index = (index + 1) % len
  }
}

module.exports = loop
