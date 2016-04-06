# ScoreJS

[![Build Status](https://travis-ci.org/danigb/scorejs.svg?branch=master)](https://travis-ci.org/danigb/scorejs)
[![CodeClimate](https://codeclimate.com/github/danigb/scorejs/badges/gpa.svg)](https://codeclimate.com/github/danigb/scorejs)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

__Work in progress__

Create and manipulate musical scores with javascript. The aim of this project
is to provide a common interface and a high level toolkit that make easy
build useful tools for musicians.

This library is oriented to composition, music learning, score analysis or algorithmic composition. Even you can play music with it, it's not a sequencer or DAW type software.

This code is largely based in two papers:

- Lisp as a second language, composing programs and music: http://www.mcg.uva.nl/papers/lisp2nd/functional.pdf
- Haskell School of Music: http://www.cs.yale.edu/homes/hudak/Papers/HSoM.pdf

```js
var Score = require('scorejs')

var score = Score(
  ['melody', '4/4', 'c2 d2 e2 (f2 g2) | a2 b2 | c3'],
  ['harmony', '4/4', 'Cmaj7 | Dm7 G7 | Cmaj7']
)

var ac = new AudioContext()
var player = require('scorejs/ext/player')
player.play(ac, player.piano, Score.tempo(120, score))

var pianoRoll = require('scorejs/ext/pianoroll')
var ctx = canvas.getContext('2d')
pianoRoll.draw(ctx, score)
```

## Installation

Via npm package: `npm i --save scorejs` and require it:
`var score = require('scorejs')`

For browsers use the file in the `dist` folder:

__Important:__

It uses `Object.assign` so if your environment doesn't have it you need a polyfill, for example: https://github.com/sindresorhus/object-assign

## Usage

`scorejs` models scores as collection of notes (objects with `duration` and `pitch` properties), that can be arranged sequentially o simultaneously:

```js
// a melody
var seq = score.seq(score.note(1, 'C'), score.note(1, 'D'), score.note(1, 'E'))
// a chord
var chord = score.sim(score.note(3, 'C'), score.note(3, 'E'), score.note(3, 'G'))
```

The `phrase` and `chord` functions are helpers to write the above more concisely:

```js
var seq = score.phrase('C D E', 1)
var chord = score.chord('C E G', 3)
```

You can combine elements freely:

```js
// the melody and the chord simultaneously
var song = score.sim(
  score.phrase('C D E', 1),
  score.chord('C E G', 3)
)
```

Finally, you can use a valid JSON data to define scores:

```js
var song = score(
  ['phrase', 'C D E', 1],
  ['chord', 'C E G', 3]
)
```

## Modules

ScoreJS is a collection of (pure) functions organized inside modules:

- score: create notes, rests, sequences (either simultaneously or sequentially). Transform scores and map note values.


## Tests and examples

Clone this repo and install dependencies: `npm install`

Tests are executed with `npm test`

Examples can be running with beefy: `npm -g install beefy` and then: `beefy example/pianoroll-example`

## License

The MIT License (MIT)
