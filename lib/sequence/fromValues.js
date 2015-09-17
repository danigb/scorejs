var loop = require('../stream/loop')
var event = require('./event')
var sequence = require('./sequence')

/**
 * Parse a sequence of events
 *
 * @param {String} events - a string with space separated events
 * @param {Integer|Array} durations - (Optional) a constant duration or an array of
 * durations that will cycled to assign each event (by default is 0.25)
 * @return {Array} a sequence
 *
 * @example
 * parse('a b c', 1) // => events: a b c , durations: 1 1 1
 * parse('a b c d', [1, 2]) // => durations: 1 2 1 2
 */
function parse (events, durations) {
  durations = durations || 0.25
  durations = loop(durations)
  return sequence(events.split(/\s+/).map(function (value) {
    return event([value, durations.next().value])
  }))
}

module.exports = parse
