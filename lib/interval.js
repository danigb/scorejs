'use strict';

var note = require('./note');

var INTERVALS = {
  "P1": 0, "m2": 1, "M2": 2, "m3": 3, "M3": 4, "P4": 5, "P5": 7,
  "m6": 8, "M6": 9, "m7": 10, "M7": 11, "P8": 12
}
var ASCII_BASE = 'a'.charCodeAt(0);

function transpose(n, interval) {
  n = note(n);
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(function(d) { return d.charCodeAt(0); });

}

module.exports = {
  transpose: transpose
}
