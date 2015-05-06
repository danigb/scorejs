'use strict';

module.exports = Event;

/*
 * EVENT
 * =====
 */
function Event(obj) {
  if (obj instanceof Event) return obj;
  if (!(this instanceof Event)) return new Event(obj);
  if (obj) Event.merge(this, obj);
}

Event.prototype.get = function(key) { return this[key]; }
Event.prototype.str = function() { return (this.value || "").toString(); }

/*
 * Clone this event
 */
Event.prototype.clone = function(extra) {
  var evt = new Event();
  Event.merge(evt, this);
  if(extra) Event.merge(evt, extra);
  return evt;
}

Event.merge = function(target, obj) {
 for (var i in obj) {
  if (obj.hasOwnProperty(i)) {
   target[i] = obj[i];
  }
 }
 return target;
}
