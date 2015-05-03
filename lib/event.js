'use strict';

module.exports = Event;

/*
 * EVENT
 * =====
 */
function Event(value, position, duration, type) {
  if (value instanceof Event) return value;
  if (!(this instanceof Event)) return new Event(value, position, duration, type);

  if (arguments.length == 0) {
  } else if (arguments.length == 1 && typeof(arguments[0]) == 'object') {
    merge(this, arguments[0]);
  } else {
    this.value = value;
    this.position = position;
    this.duration = duration;
    this.type = type;
  }
}

Event.prototype.merge = function(params) {
  merge(this, params);
}

/*
 * Clone this event
 */
Event.prototype.clone = function() {
  var evt = new Event();
  merge(evt, this);
  return evt;
}

function merge(target, obj) {
 for (var i in obj) {
  if (obj.hasOwnProperty(i)) {
   target[i] = obj[i];
  }
 }
 return target;
}
