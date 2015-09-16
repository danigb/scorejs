var event = require('./event')
var loop = require('./stream/loop')
var ticks = require('./duration/ticks')

/**
 * Create a sequence from a list of values and durations
 *
 * @param {String|Array} values - the array of values (the string is splitted by space)
 */
function sequence (values, durations, durationParser) {
  if (typeof values === 'string') values = values.split(' ')
  else if (!Array.isArray(values)) values = [ values ]
  durations = loop(durations || 'q')
  durationParser = durationParser || ticks

  var position = 0
  var duration = 0
  return values.map(function (value) {
    position = position + duration
    duration = ticks(durations.next().value)
    return event(position, duration, value)
  })
}

module.exports = sequence
