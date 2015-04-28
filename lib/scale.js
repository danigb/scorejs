'use strict';

module.exports = scale;

function scale(name) {
  var scale = scales[name];
  if (!scale) {
    var source = scales["C" + name.substring(1)];
    scale = buildScale(name, source);
  }
  return scale;
}

var scales = require('./scales.json');
Object.keys(scales).forEach(function(name) {
  var scale = scales[name];
  if(scale.same) {
    var source = scales[scale.same];
    scale.spell = source.spell;
    if (!source.alt) source.alt = [];
    source.alt.push(name);
  }
});

function buildScale(name, source) {
  if(!source) return null;
  var scale = { name: name };
  scale.spell = source.spell;
  scale.alt = source.alt;
  scales[name] = scale;
  return scale;
}
