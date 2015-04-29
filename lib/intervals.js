'use strict';

/*
 * intervals
 *
 * Associative array with interval information:
 * - quality: the type of interval (m, M, P, d, A)
 * - num: the interval number
 * - semitones: number of semitones
 * - oct: number of octaves
 * - dir: direction, +1 ascendent, -1 descendent interval
 */
var intervals = {};

var BASE = {"P1": 0, "A1": 1, "d2": 0, "m2": 1, "M2": 2, "A2": 3,
"d3": 2, "m3": 3, "M3": 4, "A3": 5, "d4": 4, "P4": 5, "A4": 6,
"d5": 6, "P5": 7, "A5": 8, "d6": 7, "m6": 8, "M6": 9, "A6": 10,
"d7": 9, "m7": 10, "M7": 11, "A7": 12, "d8": 11, "P8": 12 }

function int(i, q, n, s, d) {
  var o = Math.floor(s / 12);
  return { name: i, quality: q, num: n, semitones: s, dir: d, oct: o };
}

// Basic intervals ascending
Object.keys(BASE).forEach(function(n) {
  intervals[n] = int(n, n[0], +n.slice(1), BASE[n], 1);
});
// Basic descending intervals
Object.keys(BASE).forEach(function(n) {
  intervals['-' + n] = int('-' + n, n[0], +n.slice(1), BASE[n], -1);
});

module.exports = intervals;
