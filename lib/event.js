
var EMPTY = [0, 0, null]

function event (position, duration, value, event) {
  event = event || EMPTY
  position = position !== null ? position : event[0]
  duration = duration !== null ? duration : event[1]
  value = value !== null ? value : event[2]
  return [position, duration, value]
}

module.exports = event
