'use strict';

var _ = require('lodash');

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

    return new Score.Sequence(_.sortBy(events, 'position'));
  }
}
