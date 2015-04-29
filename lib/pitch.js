'use strict';

var interval = require('./interval.js');

/* PITCH
 * =====
 *
 * pitch convert the given arguments to a pich array:
 * [note name, octave]
 *
 * The note name (c#) includes the pitch class (c)
 * and the accidentals (#)
 *
 * Given a pitch array you can get:
 * - Pitch class: pitch[0][0]
 * - Accidentals: pitch[0].slice(1)
 *
 */
var MID_OCT = 4;
var REGEX = /^\s*([abcdefgr][b#]*)([+-]*)/;
var NAME = 0;
var OCT = 1;
function pitch() {
  var m, args = arguments;
  if(args.length == 0) return;
  else if (Array.isArray(args[0])) return args[0];
  else if (args.length == 1 && (m = REGEX.exec(args[0]))) {
    var name = m[1];
    var oct = MID_OCT + (m[2][0] == '-' ? -1 : 1) * m[2].length
    return [name, oct];
  } else {
    return [args[0], +args[1]];
  }
}

/*
 * pitch.midi
 *
 * Given a pitch, return the midi note number
 *
 */

// MIDI notes for A, B, C ... G
var MIDI = [69, 71, 60, 62, 64, 65, 67];
var CHAR_BASE = 'a'.charCodeAt(0);

pitch.midi = function(p) {
  p = pitch(p);
  var base = MIDI[p[0].charCodeAt(0) - CHAR_BASE];
  var acc = (p[0].slice(1) == '#' ? 1 : -1) * (p[0].length - 1);
  var oct = (p[1] - MID_OCT) * 12;
  return base + acc + oct;
}

/*
 * pitch.transpose
 *
 * Transpose pitch array to a interval ammount
 * arguments:
 * - pitch array
 * - interval string
 * Returns a new pitch array
 */
var ACCIDENTALS = {"0": "", "1": "#", "2": "##", "-1": "b", "-2": "bb"};
pitch.transpose = function(src, intervalName) {
  var int = interval(intervalName);
  if (!int) throw "Interval " + intervalName + "not found.";

  src = pitch(src);
  var dest = pitchShift(src, int);
  var distance = pitch.midi(dest) - pitch.midi(src);
  var difference = (int.semitones - distance) % 12;
  var acc = ACCIDENTALS['' + difference];
  return [dest[NAME] + acc, src[OCT] + int.oct];
}

/*
 * Brute force shift: move the note name up interval.num times.
 */
function pitchShift(src, interval) {
  var name = String.fromCharCode((src[NAME].charCodeAt(0) -
    CHAR_BASE + interval.num - 1) % 7 + CHAR_BASE);
  return [name, src[OCT] + interval.oct];
}

/*
 * Convert pitch array to a impro-visor notation string
 */
var OCTSTR = ['----', '---', '--', '-', '', '+', '++', '+++', '++++'];
pitch.str = function(p) {
  p = pitch(p)
  return p[NAME] + OCTSTR[p[OCT]];
}

module.exports = pitch;
