'use strict';

module.exports = note;

var NOTE = /^\s*([abcdefgr])([+-]*)/;
function note(name) {
  var m = NOTE.exec(name);
  return {
    name: name,
    note: m[1],
    oct: octave(m[2])
  }
}

function octave(val) {
  var oct = 2;
  var mod = val.slice(0,1) == '-' ? -1 : 1;
  return oct + mod * val.length;
}
