'use strict';

module.exports = function(time, chords) {
  return parse(time, measures(chords));
}

function parse(t, measures) {
  var events = [];
  var pos = 0;
  measures.forEach(function(m) {
    var chords = m.split(/\s+/);
    //console.log("MEASURE", m, chords);
    var dur = 1 * t.measure / chords.length;
    chords.forEach(function(chord) {
      events.push({ pos: pos, dur: dur, value: chord });
      pos += dur;
    });
  });
  return events;
}

function measures(repr) {
  return repr
    .replace(/\s+\||\|\s+/, '|') // spaces between |
    .replace(/^\||\|\s*$/g, '') // first and last |
    .split('|');
}
