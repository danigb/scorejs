'use strict';

module.exports = scale;

var cache = {};
function scale(name) {
  var scale = dictionary[name];
  if (!scale) {
    var source = dictionary["C" + name.substring(1)];
    scale = buildScale(name, source);
  }
  return scale;
}

var dictionary = require('./data/scales.json');
Object.keys(dictionary).forEach(function(name) {
  var scale = dictionary[name];
  if(scale.same) {
    var source = dictionary[scale.same];
    scale.spell = source.spell;
    if (!source.alt) source.alt = [];
    source.alt.push(name);
  }
  scale.score = function() { return scale.spell; }
});

function buildScale(name, source) {
  if(!source) return null;
  var scale = { name: name };
  scale.spell = source.spell;
  scale.alt = source.alt;
  dictionary[name] = scale;
  return scale;
}
