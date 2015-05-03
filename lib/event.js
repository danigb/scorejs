'use strict';

module.exports = Event;

function Event(value, position, duration, type) {
  if (!(this instanceof Event)) return new Event(value, position, duration, type);

  this.value = value;
  this.position = position;
  this.duration = duration;
  this.type = type;
}
