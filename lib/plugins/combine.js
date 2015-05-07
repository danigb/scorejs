'use strict';

var _ = require('lodash');

module.exports = function(Score) {
  /*
   * MERGE
   *
   */
  Score.fn.merge = function() {
    var seqs;
    if(arguments.length == 0) return;

    if(typeof(arguments[0].sources) !== "undefined") {
      var score = this.score || {};
      var part;
      seqs = arguments[0].sources.map(function(n) {
        part = score[n];
        return part ? part : Score.Sequence(n);
      });
    } else {
      seqs = arguments;
    }
    var events = [].concat(this.events);
    for(var i = 0; i < arguments.length; i++) {
      events = events.concat(arguments[i].events);
    }
    return new Score.Sequence(_.sortBy(events, 'position'));
  }
}
