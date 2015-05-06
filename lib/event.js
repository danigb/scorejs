'use strict';

module.exports = Event;

/*
 * EVENT
 * =====
 */
function Event(obj) {
  if (obj instanceof Event) return obj;
  if (!(this instanceof Event)) return new Event(obj);
  this._e = Event.merge({}, obj || {});
}

Event.prototype.get = function(key) { return this._e[key]; }

Event.prototype.value = function() { return this._e.value; }
Event.prototype.position = function() { return this._e.position || 0; }
Event.prototype.duration = function() { return this._e.duration || 0; }
Event.prototype.type = function() { return this._e.type ; }
Event.prototype.str = function() { return (this.value() || "").toString(); }

/*
 * Clone this event
 */
Event.prototype.clone = function(extra) {
  var evt = new Event(this._e);
  if(extra) Event.merge(evt._e, extra);
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
