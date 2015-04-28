'use strict';

module.exports = Note;


var NOTE = /^\s*([abcdefgr])([+-]*)/;

function Note(name) {
  if(name instanceof Note) return name;
  if (!(this instanceof Note)) return new Note(name);

  var m = NOTE.exec(name);
  this.name = name;
  this.note = m[1];
  this.oct = parseOct(m[2]);
  this.str = m[1] + this.oct; // teoria compatibility
}

function parseOct(val) {
  var oct = 2;
  var mod = val.slice(0,1) == '-' ? -1 : 1;
  return oct + mod * val.length;
}
