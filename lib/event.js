'use strict';

module.exports = Event;

/*
 * EVENT
 * =====
 * An immutable Event.
 */
function Event(value, position, duration, type) {
  if (value instanceof Event) return value;
  if (!(this instanceof Event)) return new Event(value, position, duration, type);

  if (arguments.length == 1 && typeof(arguments[0]) == 'object') {
    this._data = merge({}, arguments[0]);
  } else {
    this._data = { value: value, position: position, duration: duration, type: type };
  }
}
Event.prototype.value = function() { return this._data.value; }
Event.prototype.position = function() { return this._data.position; }
Event.prototype.duration = function() { return this._data.duration; }
Event.prototype.type = function() { return this._data.type; }

Event.prototype.set = function(name, value) {
  var evt = this.clone();
  evt._data[name] = value;
  return evt;
}

Event.prototype.get = function(name) {
  return this._data[name];
}

/*
 * Clone this event
 */
Event.prototype.clone = function() {
  return new Event(this._data);
}

/*
 * Clone this event and merge the object properties on it
 */
Event.prototype.merge = function(object) {
  var evt = this.clone();
  merge(evt._data, object);
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
