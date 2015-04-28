'use strict';

module.exports = Note;

var Interval = require('./interval.js');

/* Note
 * ====
 *
 *
 */
var NOTE = /^\s*([abcdefgr][b#]*)([+-]*)/;
var MIDI = {'C': 60, 'D': 62, 'E': 64, 'F': 65, 'G': 67, 'A': 69, 'B': 71};
function Note(arg) {
  if(arg instanceof Note) return arg;
  if (!(this instanceof Note)) return new Note(arg);

  if (typeof arg === 'string') {
    var m = NOTE.exec(arg);
    this.name = m[1];
    this.oct = parseOct(m[2]);
  } else {
    this.name = arg.name.toLowerCase();
    this.oct = +arg.oct || 4;
  }
}

function parseOct(val) {
  return 4 + (val[0] == '-' ? -1 : 1) * val.length;
}

function accAmount(acc) {
  return (acc[0] == 'b' ? -1 : 1) * acc.length;
}

Note.midi = function(name, oct) {
  return MIDI[name[0].toUpperCase()]+
    accAmount(this.acc()) +
    12 * (this.oct - 4);
}

/*
 * toString
 * ========
 *
 */
Note.str = function(name, oct) {
  return name + modifier(oct - 4, '+', '-');
}
proto.toString = proto.str = function() { Note.str(this.name, this.oct); }

/* Given a number, return a modifier with that length.
 * For example: 

function modifier(n, up, down) {
  if (n > 0) return Array(n + 1).join(up);
  else if (n < 0) return Array(-1 * n + 1).join(down);
  else return "";
}


/* transpose
 *
 * Transpose the note the given interval
 */
proto.transpose = proto.t = function(interval) {
  interval = new Interval(interval);
  var pitchClass = shiftPitchClass(this.pitchClass(), interval.amount);
  var note = new Note({name: pitchClass, oct: this.oct + interval.octaves});
  var dif = (note.midi - this.midi) - interval.semitones;
  Note.str(pitchClass + modifier(dif, '#', 'b'), note.octave);
}

var ACHARCODE = 'A'.charCodeAt(0);
function shiftPitchClass(pitchClass, amount) {
  return String.fromCharCode(
    (pitchClass.charCodeAt(0) - ACHARCODE + amount) % 7 + ACHARCODE
  );
}
