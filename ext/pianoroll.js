var forEachTime = require('../lib/timed').forEachTime
var toMidi = require('note-midi')

var box = {
  width: 300, height: 200,
  base: 30, time: 20, pitch: 10,
  x: function (time) { return time * box.time },
  y: function (midi) { return box.height - (midi - box.base + 1) * box.pitch },
  nw: function (duration) { return duration * box.time - 1 },
  nh: function () { return box.pitch - 1 }
}

function canvas (w, h, parent) {
  parent = parent || document.body
  var canvas = document.createElement('canvas')
  canvas.width = w || 200
  canvas.height = h || 200
  parent.appendChild(canvas)
  return canvas.getContext('2d')
}

function build (obj) {

}

/**
 * Draw a piano roll
 */
function draw (ctx, score) {
  console.log(score)
  drawStripes(box, ctx)
  forEachTime(function (time, note) {
    var midi = toMidi(note.pitch)
    console.log(time, note, midi)
    ctx.fillRect(box.x(time), box.y(midi), box.nw(note.duration), box.nh())
  }, null, score)
}

var ALT = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]

function drawStripes (box, ctx) {
  var alt
  var num = box.height / box.pitch
  ctx.fillStyle = '#efefef'
  for (var i = 0; i < num; i++) {
    alt = ALT[(box.base + num - i) % 12]
    ctx.fillRect(0, box.y(box.base + num - i), box.width, alt ? 10 : 1)
  }
  for (var v = 0; v < box.width / box.time; v++) {
    ctx.fillRect(v * box.time, 0, 1, box.height)
  }
  ctx.fillStyle = '#000000'
}

module.exports = { build: build, draw: draw, canvas: canvas }
