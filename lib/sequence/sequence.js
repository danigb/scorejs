var event = require('./event')

/**
 * Sequence an array of events.
 *
 * @param {String|Array} values - the array of values (the string is splitted by space)
 */
function sequence (events) {
  events = events.map(event)
  var position = 0
  var duration = 0
  return events.map(function (e) {
    position += duration
    duration = e.duration
    return event(e, { position: position })
  })
}

module.exports = sequence
