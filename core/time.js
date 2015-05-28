'use strict';

module.exports = function(Score) {
  /*
   * Repeat a sequence 'times' times
   *
   * @param {Integer} times - the number of times to be repeated
   */
  Score.fn.repeat = function(times) {
    var duration = this.duration();
    return this.transform(function(event) {
      return range(times).map(function(i) {
        return Score.event(event, { position: event.position + duration * i });
      });
    });
  }

  /*
   * Delay
   *
   * Delay a sequence by a distance
   *
   * Params:
   * - distance: space between the event and the delayed event in ticks
   */
  Score.fn.delay = function(distance) {
    return this.transform(function(event) {
      return Score.event(event, { position: event.position + distance });
    });
  }
}

function range(number) {
  var array = [];
  for(var i = 0; i < number; i++) {
    array.push(i);
  }
  return array;
}
