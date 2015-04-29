'use strict';

module.exports = transpose;

var pitch = require('../pitch.js');

function transpose(interval) {
  return function(score) {
    score.forEach(function(e) {
      e.value = pitch.transpose(e.value, interval);
    });
    return score;
  }
}
