/* global describe it */

var assert = require('assert')
var _ = require('..')

describe('notes', function () {
  it('can create a note', function () {
    assert.deepEqual(_.note('A', 3, { inst: 'synth' }),
      { pitch: 'A', duration: 3, inst: 'synth' })
  })
  it('can create phrases', function () {
    assert.deepEqual(_.phrase('A B C D', '1 0.5'), [ 'seq',
        { pitch: 'A', duration: 1 },
        { pitch: 'B', duration: 0.5 },
        { pitch: 'C', duration: 1 },
        { pitch: 'D', duration: 0.5 } ])
  })
  it('can create chords', function () {
    assert.deepEqual(_.chord('C E G'), [ 'par',
    { pitch: 'C', duration: 1 },
    { pitch: 'E', duration: 1 },
    { pitch: 'G', duration: 1 } ])
  })
})

describe('structures', function () {
  it('can create sequential', function () {
    assert.deepEqual(_.seq(_.note('A'), _.note('B')), ['seq',
      { pitch: 'A', duration: 1 },
      { pitch: 'B', duration: 1 } ])
  })
  it('can create parallel', function () {
    assert.deepEqual(_.par(_.note('A'), _.note('B')), ['par',
      { pitch: 'A', duration: 1 },
      { pitch: 'B', duration: 1 } ])
  })
})

describe('transform', function () {
  var T = _.transform(
    function (note) { return note.pitch },
    function (seq) { return '(' + seq.join(',') + ')' },
    function (par) { return '[' + par.join('+') + ']' }
  )
  it('can transform notes', function () {
    assert.deepEqual(T(_.note('A')), 'A')
  })
  it('can transform sequences', function () {
    assert.deepEqual(T(_.phrase('A B C')), '(A,B,C)')
  })
  it('can transform parallel', function () {
    assert.deepEqual(T(_.chord('A B C')), '[A+B+C]')
  })
  it('can transform musical structures', function () {
    assert.deepEqual(T(_.par(
      _.phrase('A B C'), _.seq(_.chord('C E G'), _.chord('D F A'))
    )), '[(A,B,C)+([C+E+G],[D+F+A])]')
  })
})

describe('map', function () {
  it('can map notes', function () {
    var transform = _.map(function (note) {
      return Object.assign({}, note, { inst: 'piano' })
    })
    assert.deepEqual(transform(_.seq(_.chord('A B'), _.chord('B C'))),
      ['seq',
        ['par', { pitch: 'A', duration: 1, inst: 'piano' },
        { pitch: 'B', duration: 1, inst: 'piano' }],
        ['par', { pitch: 'B', duration: 1, inst: 'piano' },
        { pitch: 'C', duration: 1, inst: 'piano' }]
      ])
  })
})

describe('with', function () {
  it('can be applied to a note', function () {
    assert.deepEqual(_.with({ inst: 'piano' }, _.note('A')),
      { pitch: 'A', duration: 1, inst: 'piano' })
  })
  it('can be applied to a structure', function () {
    assert.deepEqual(_.with({inst: 'piano'}, _.seq(_.chord('A'), _.chord('B'))),
      ['seq',
        ['par', { duration: 1, pitch: 'A', inst: 'piano' }],
        ['par', { duration: 1, pitch: 'B', inst: 'piano' }]
      ])
  })
})

describe('mapVal', function () {
  it('can map note properties', function () {
    var transpose = _.mapVal('pitch', function (pitch) {
      return pitch.toLowerCase()
    })
    assert.deepEqual(transpose(_.phrase('C D E')), ['seq',
      { pitch: 'c', duration: 1 },
      { pitch: 'd', duration: 1 },
      { pitch: 'e', duration: 1 } ])
  })
})

describe('forEachTime', function () {
  it('have time', function () {
    var ctx = []
    _.forEachTime(function (time, note, ctx) {
      ctx.push(time)
    }, _.par(_.phrase('C D E'), _.phrase('E F G')), ctx)

    assert.deepEqual(ctx, [ 0, 1, 2, 0, 1, 2 ])
  })
})

describe('events', function () {
  it('have ordered events', function () {
    assert.deepEqual(_.events(_.par(_.phrase('A B C'), _.phrase('D'))),
    [ [ 0, { pitch: 'A', duration: 1 } ],
      [ 0, { pitch: 'D', duration: 1 } ],
      [ 1, { pitch: 'B', duration: 1 } ],
      [ 2, { pitch: 'C', duration: 1 } ] ])
  })
})
