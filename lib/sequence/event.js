'use strict'

/**
 * Create an event
 *
 * @example
 * event('value') // => { position: 0, duration: 0, value: 'value'}
 * event('value', 10) // => { position: 0, duration: 10, value: 'value'}
 * event('value', 10, 20) // => { position: 20, duration: 10, value: 'value'}
 * event('over', null, null, event('value', 10, 20)) // => { position: 20, duration: 10, value: 'over'}
 */
function event (src, other) {
  var event = build()
  if (src) merge(event, build(src))
  if (other) merge(event, build(other))
  return event
}

function build (e) {
  if (!e) return { value: null, duration: 0, position: 0 }
  if (typeof e === 'string') return { value: e, duration: 0, position: 0 }
  else if (Array.isArray(e)) return { value: e[0], duration: e[1], position: e[2] }
  else return { value: e.value, duration: e.duration, position: e.position }
}

function merge (event, other) {
  if (!other) return
  ['position', 'duration', 'value'].forEach(function (prop) {
    if (other[prop] || other[prop] === 0) event[prop] = other[prop]
  })
}

module.exports = event
