'use strict'

module.exports = function (Score) {
  /*
   * Return a sequence with the events between 'begin' and 'end'
   */
  Score.fn.region = function (begin, end) {
    return Score(this.sequence.filter(function (event) {
      return event.position >= begin && event.position < end
    }))
  }
}
