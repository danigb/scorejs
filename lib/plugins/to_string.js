'use strict';

var pitch = require('../pitch.js');
/*
 * toString: print scores back to notation
 */
module.exports = function() {
  return function(score) {
    return score.map(function(e) {
      return pitch.str(e.value);
    }).join(' ');
  }
}
