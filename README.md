# ScoreJS

[![CodeClimate](https://codeclimate.com/github/danigb/scorejs/badges/gpa.svg)](https://codeclimate.com/github/danigb/scorejs)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Create and manipulate musical scores with javascript. The aim of this project
is to provide a common interface and a high level toolkit that make easy
build useful tools for musicians.

This library is oriented to music learning, score analysis or algorithmic
composition. Even you can play music with it, it's not a sequencer or DAW type
software.

```js
var Score = require('scorejs').init()

var score = Score.simultaneously(
  Score.melody('4/4', 'c2 d2 e2 (f2 g2) | a2 b2 | c3')
  Score.harmony('4/4', 'Cmaj7 | Dm7 G7 | Cmaj7')
)

var ac = new AudioContext()
var player = require('scorejs/ext/player')
player.play(player.piano(ac), score)

var pianoRoll = require('scorejs/ext/pianoroll')
var ctx = canvas.getContext('2d')
pianoRoll.draw(ctx, score)
```

## Installation

Via npm package: `npm i --save scorejs` and require it:
`var score = require('scorejs')`

For browsers use the file in the `dist` folder:

## Usage

## License

The MIT License (MIT)
