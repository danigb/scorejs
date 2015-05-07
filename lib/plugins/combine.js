'use strict';

var sortBy = require('lodash/collection/sortBy');

module.exports = function(Score) {
  /*
   * MERGE
   *
   */
  Score.fn.merge = function() {
    if(arguments.length == 0) this;

    var events = [].concat(this.events);

    for(var i = 0; i < arguments.length; i++) {
      var seq = arguments[i];
      seq = this.score ? this.score.part(seq) : Score.Sequence(seq);
      events = events.concat(seq.events);
    }

    return new Score.Sequence(sortBy(events, 'position'));
  }
}
