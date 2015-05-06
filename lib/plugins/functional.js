
var _ = require('lodash');

module.exports = function(Score) {
  Score.fn.merge = function() {
    var events = [].concat(this.events);
    console.log("INIT", events);
    for(i = 0; i < arguments.length; i++) {
      events = events.concat(arguments[i].events);
    }
    return new Score.Sequence(_.sortBy(events, 'position'));
  }
}
