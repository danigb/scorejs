'use strict';

var teoria = require('teoria');

module.exports = Sequence;

function Sequence(source, options) {
  if (!(this instanceof Sequence)) return new Sequence(source, options);

  if(Array.isArray(source)) {
    this.seq = source;
  } else if (source instanceof teoria.TeoriaScale) {
    this.seq = source.notes();
  } else {
    this.seq = [];
  }
}
Sequence.fn = Sequence.prototype;

/*
 * Internal 'plugins'
 */
var $ = Sequence;
$.fn.toString = function () {
  return this.seq.map(function(e) { return e.toString();}).join(' ');
}
$.fn.forEach = $.fn.each = function() {
  Array.prototype.forEach.apply(this.seq, arguments);
  return this;
}
$.fn.map = function() {
  return new Sequence(Array.prototype.map.apply(this.seq, arguments));
}
