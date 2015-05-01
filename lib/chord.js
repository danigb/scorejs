'use strict';

var teoria = require('teoria');
var dictio = require('./data/chords.json');
var $ = require('./seq.js');

module.exports = Chord;

var cache = {};
function Chord(name, base) {
  if (!(this instanceof Chord)) return cache[name] || buildChord(name);
  this.teoria = teoria.chord(name);
  this.name = this.teoria.name;
  this.base = base;
}

var proto = Chord.prototype;

proto.notes = function() {
  return $(this.teoria.notes());
}

function buildChord(name) {
  var base = dictio["C" + name.substring(1)];
  if (base) {
    var chord = new Chord(name, base)
    cache[name] = chord;
    return chord;
  }
}
