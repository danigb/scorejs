'use strict';

var interval = require('./intervals.js');

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
 */
pitch.transpose = function(p, i) {
  i = interval(i);
  if(i) {
    p = pitch(p);
    var pitchClass = String.fromCharCode((p[0].charCodeAt(0) -
      CHAR_BASE + i.num - 1) % 7 + CHAR_BASE);
    var a = pitch.midi(p);
    var b = pitch.midi([pitchClass, p[1] + i.oct]);
    var dif = (b - a) - i.semitones;
    var acc = dif == 0 ? '' : Array[dif + 1].join((dif < 0 ? '#' : 'b'));
    return [pitchClass + acc, p[1] + i.oct];
  }
}
/*
 * pitch.i (impro-visor)
 *
 * Convert pitch array to a impro-visor notation string
 */
pitch.i = function(p) {
  p = pitch(p)
  var oct = p[1] == MID_OCT ? '' :
    (p[1] > MID_OCT ? Array(p[1] - 3).join('+')
     : Array(p[1] - 1).join('-'));
  return p[0] + oct;
}

module.exports = pitch;
