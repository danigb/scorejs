'use strict';

module.exports = transpose;

var pitch = require('../pitch.js');

function transpose(interval) {
  this.forEach(function(note) {
    note.transpose(interval);
  });
  return this;
}
