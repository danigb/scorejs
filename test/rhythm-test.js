/* global describe it */

var assert = require('assert')
var rhythm = require('../lib/rhythm')

describe('Rhythm module', function () {
  describe('pattern function', function () {
    it('create rhythm with duration 1 elements', function () {
      assert.deepEqual(rhythm.pattern('x.x.'), [ 'seq',
        { pitch: 'x', duration: 1 },
        { pitch: '.', duration: 1 },
        { pitch: 'x', duration: 1 },
        { pitch: '.', duration: 1 } ])
    })
  })

  describe('ioi function', function () {
    it('creates rhythm from interOnsetInterval', function () {
      assert.deepEqual(rhythm.ioi('233'), rhythm.pattern('x.x..x..'))
    })
  })
})
