/* global describe it */

var assert = require('assert')
var score = require('..')
var pianoroll = require('../ext/pianoroll')

describe('Piano roll', function () {
  describe('build', function () {
    it('has default size', function () {
      var pr = pianoroll.build(null, score.phrase('a b c'))
    })
  })
})
