'use strict';

module.exports = scale;

var teoria = require('teoria');
var dictionary = require('./data/scales.json');

var cache = {};
function scale(name) {
  var space = name.indexOf(' ');
  return teoria.note(name.slice(0, space)).scale(name.slice(space + 1));
}
