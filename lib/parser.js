'use strict';

/*
 * Parse
 * =====
 *
 */
var parse = function(time, repr) {
  if(!repr) return [];
  return parse.isNotes(repr) ?
    parseNotes(time, tokenizeNotes(repr)) :
    parseMeasures(time, splitMeasures(repr));
}

function evt(value, dur, pos, vol) {
  pos = pos | 0;
  vol = vol | 100;
  return { value: value, dur: dur, pos: pos, vol: vol};
}

/*
 * NOTES
 */
parse.isNotes = function(repr) {
  return /^[#ra-g\d|\/\s+]+$/.test(repr);
}

function parseNotes(time, tokens) {
  var r = /([abcdefgr][+|-]*)(\d+)/;
  return tokens.map(function(token) {
    var m = r.exec(token);
    return evt(m[1], time(+m[2]));
  });
}

function tokenizeNotes(notes) {
  return notes
    .replace(/\s*([abcdefgr])/, function(a, b) { return b; })
    .split(' ');
}

/*
 * PARSE MEASURES
 */
function parseMeasures(t, measures) {
  var events = [];
  measures.forEach(function(m) {
    var blocks = m.trim().split(/\s+/);
    var dur = 1 * t.measure / blocks.length;
    blocks.forEach(function(block) {
      events.push(evt(block, dur));
    });
  });
  return events;
}

function splitMeasures(repr) {
  return repr
    .replace(/\s+\||\|\s+/, '|') // spaces between |
    .replace(/^\||\|\s*$/g, '') // first and last |
    .split('|');
}

module.exports = parse;
