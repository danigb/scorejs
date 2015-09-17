var duration = require('../duration/measure')
var event = require('./event')
var sequence = require('./sequence')

var MEASURE = /\s*\|\s*/
var SPACES = /\s+/

/**
 * Parse a string with measure(s) and return a event
 *
 *
 * @example
 * parse('a b c d | d e ') // => durations: q q q q w w
 */
function parse (measures, meter, repeatedEvent) {
  meter = meter || '4/4'
  var measureDur = duration(meter)

  var events = []
  measures.split(MEASURE).forEach(function (measure) {
    var values = measure.split(SPACES)
    var duration = measureDur / values.length
    values.forEach(function (value, index) {
      events.push(event([value, duration]))
    })
  })
  return sequence(events)
}

module.exports = parse
