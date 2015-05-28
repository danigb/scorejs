# ScoreJS

Create and manipulate musical scores with javascript. The aim of this project
is to provide a common interface and a high level toolkit that make easy
build useful tools for musicians.

```js
  var Score = require('scorejs');
  var melody = Score('a b c d e f g').transpose('M2');
  var chords = Score('Cmaj7 | Dm7 G7').leftHandPiano();
  Score.merge(melody, chord).play({ tempo: 110 });
```

The library is extensible using plugins and several of the are available.

## Usage

Install the npm package: `npm i --save scorejs` and require it:
`var Score = require('scorejs')`

### Run tests and build dist file

You can use the `dist/score.js` module in browser environments. This file is
up-to-date in the respository, buf if you want to re-build it, clone this
repository and `npm run-script build`.

To run test, clone this respository and `npm test`.

### Basic usage

You can create sequences (ordered list of timed events) with Score function,
and access them with `sequence` property:

```js
s = Score('c/8 e/8 d4 g4');
s.sequence; // => an array of events
```

It uses [note-duration](http://github.com/danigb/note-duration) to parse note
durations.

Given a sequence you can manipulate them chaining methods:

```js
  Score('a b c').reverse().delay(100);
```

The same of above can be written in a more declarative manner:

```js
Score('a b c', { reverse: true, delay: 100 });
```

Or even complex scores can be written in that way:

```js
  score = Score.build({
    melody: {
      score: "r8 e8 f8 e8 b8 b4."
      transpose: 'M2'
    },
    chords: {
      score: "EbMaj7 Edim7 | Fm7 F#dim7"
    },
    piano: {
      score: "chords",
      leftHandPiano: true
    },
    bass:
    score: "chords",
    walkingBass: true
  });

  score.play( { tempo: 100 } );
```

## API

#### Score(source [, time] [, transfom]);

Create a score object. Basically is an array of events ordered by time position
with a time signature.

An optional time argument to specify the time signature ("4/4" by default)

If the transform parameter is a function, a new Score is created by map all
the events with the function:

```js
Score('a b', function(event) {
  event.value = event.value.toUpperCase();
  return value;
}); // => values: 'A', 'B'
```

But it have some important differences from map. First of all, the null values
are removed, so transform function can __remove events__:

```js
Score('a b c', function(event) {
  if(event.value !== 'b') return event;
}); // this creates a score with TWO events ('b' is removed)
```

The transform function is capable to __add events__ if wrapping them in an array:

```js
Score('a b', function(event) {
  return [event, event];
}); // score events values are: ['a', 'a', 'b', 'b']
```

#### Score.event(obj, ...)

#### Score.merge(s1, s2, ...)

#### Score.concat(s1, s2, ...)

### Score object

#### score.time

The time signature of the score. "4/4" by default.

#### score.sequence

The sequence property give access to the array of events.

#### score.transform(transform)

#### score.clone

#### score.duration

## Core plugins

### Time

Time related methods:

#### repeat(times)

#### delay(duration)

### Selection

### Musical

## Build your own plugin

```js
// A plugin is a function with one parameter: the Score
module.exports = function(Score) {}

  // It adds method to Score instances using Score.fn
  Score.fn.delay = function(distance) {
    // use transform api to return a modified sequence
    this.transform(function(event) {
      event.position += distance;
      return event;
    });
  }
}
```

## License

The MIT License (MIT)
