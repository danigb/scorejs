var tonal = require('tonal')
var curry = require('ramda/src/curryN')

function _ () {

}

/**
 * Convert a sequence into an array
 */
_.arr = Array.from

/**
 * Create an event object
 *
 * @param {Object} event
 * @param {Object} modify
 * @return {event} the event
 */
_.event = function (event, mod) {
  return Object.assign({ type: 'event', time: 0 }, event, mod)
}

/**
 * Create a note sequence
 */
_.note = function * (note, dur) {
  var n = tonal.note(note)
  if (n) yield _.event({ type: 'note', val: n, dur: dur || 1 })
}

_.rest = function * (dur) {
  yield _.event({ type: 'rest', dur: dur || 1 })
}

_.notes = function * (notes, dur) {
  if (typeof notes === 'string') notes = notes.split(/\s+/)
  for (var n of notes) {
    if (n === 'r') yield _.rest().next().value
    else yield _.note(n, dur).next().value
  }
}

_.map = curry(4, function * (filter, param, fn, events) {
  var mapFn = fn ? (typeof fn === 'function' ? fn : function () { return fn }) : null
  for (var e of events) {
    if (param) {
      var merge = {}
      merge[param] = mapFn(e[param])
      yield _.event(e, merge)
    }
    else yield fn(e)
  }
})

_.startAt = function (time, events) {
  time = time || 0
  return _.map(null, 'time', function (t) {
    return time + t
  }, events)
}

_.consecutive = function (events) {
  var time = 0
  return _.map(null, null, function (e) {
    var t = time
    time += e.dur || 0
    return _.event(e, { time: t })
  }, events)
}

_.concat = function * (a, b) {
  var time = 0
  for (var e of _.startAt(0, a)) {
    time = e.time + (e.dur || 0)
    yield e
  }
  yield * _.startAt(time, b)
}

module.exports = _
