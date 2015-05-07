'use strict';

var _ = require('./dash.js');

module.exports = Event;

/*
 * EVENT
 * =====
 */
function Event(obj) {
  if (obj instanceof Event) return obj;
  if (!(this instanceof Event)) return new Event(obj);
  if (obj) _.assign(this, obj);
}

Event.prototype.str = function() { return (this.value || "").toString(); }

/*
 * Clone this event
 */
Event.prototype.clone = function(extra) {
  return _.assign(new Event(), this, extra);
}
