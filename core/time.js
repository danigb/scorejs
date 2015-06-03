'use strict'

module.exports = function (Score) {
  /*
   * Return the total duration of the score
   */
  Score.prototype.duration = function () {
    var last = this.sequence[this.sequence.length - 1]
    return last.position + last.duration
  }

  Score.fn.toTempo = function (beatsPerMinute) {
    var factor = 60 / beatsPerMinute
    return Score(this.sequence, function (event) {
      return Score.event(event, {
        position: event.position * factor,
        duration: event.duration * factor
      })
    })
  }

  Score.fn.reverse = function () {
    return compactTime(this.sequence.reverse())
  }

  Score.fn.compact = function () {
    return compactTime(this.sequence)
  }

  function compactTime (sequence) {
    var position = 0
    return Score(sequence, function (event) {
      var evt = Score.event(event, { position: position })
      position += event.duration
      return evt
    })
  }

  /*
   * Repeat a sequence 'times' times
   *
   * @param {Integer} times - the number of times to be repeated
   */
  Score.fn.repeat = function (times) {
    var duration = this.duration()
    return new Score(this, function (event) {
      return range(times).map(function (i) {
        return Score.event(event, { position: event.position + duration * i })
      })
    })
  }

  Score.fn.loopUntil = function (max) {
    if (this.duration() === 0) return this

    var looped = []
    var total = this.sequence.length
    var event, index = 0, position = 0
    while (position < max) {
      event = this.sequence[index++ % total]
      looped.push(Score.event(event, { position: position }))
      position += event.duration
    }
    return new Score(looped)
  }

  /*
   * Delay
   *
   * Delay a sequence by a distance
   *
   * Params:
   * - distance: space between the event and the delayed event in ticks
   */
  Score.fn.delay = function (distance) {
    return Score(this, function (event) {
      return Score.event(event, { position: event.position + distance })
    })
  }
}

function range (number) {
  var array = []
  for (var i = 0; i < number; i++) {
    array.push(i)
  }
  return array
}
