'use strict';

module.exports = transpose;

var pitch = require('../pitch.js');

function transpose(interval) {
  return function(events, score) {
    events.forEach(function(e) {
      e.value = pitch(e.value);
      e.value.transpose(interval);
    });
  }
}
