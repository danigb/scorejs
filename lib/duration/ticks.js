'use strict'

var value = require('./value')
var TICKS = 96 * 4 * 4

function ticks (name, ticksPerQuarter) {
  var ticks = ticksPerQuarter ? ticksPerQuarter * 4 : TICKS
  return value(name) * ticks
}

module.exports = ticks
