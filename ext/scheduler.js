
var DEFAULTS = {
  // time in milliseconds of the scheduler lookahead
  lookahead: 500,
  overlap: 250
}

/**
 *
 */
function schedule (ac, time, events, fn, options) {
  console.log(events)
  time = Math.max(time, ac.currentTime)
  var opts = DEFAULTS
  var id = null
  var nextEvtNdx = 0

  function scheduleEvents () {
    var current = ac.currentTime
    var from = current - time
    var to = current + (opts.lookahead + opts.overlap) / 1000
    console.log('scheduling', from, to)
    var next = events[nextEvtNdx]
    while (next && next[0] >= from && next[0] < to) {
      fn(time + next[0], next[1])
      console.log('event', next, current, time, time + next[0])
      nextEvtNdx++
      next = events[nextEvtNdx]
    }
    if (next) id = setTimeout(scheduleEvents, opts.lookahead)
  }
  scheduleEvents()

  return {
    stop: function () {
      clearTimeout(id)
    }
  }
}

module.exports = { schedule: schedule }
