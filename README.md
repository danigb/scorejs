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

## Installation

Install the npm package: `npm i --save scorejs` and require it:
`var Score = require('scorejs')`

### Run tests and build dist file

You can use the `dist/score.js` module in browser environments. This file is
up-to-date in the respository, buf if you want to re-build it, clone this
repository and `npm run-script build`.

To run test, clone this respository and `npm test`.

## Usage

You can create sequences (ordered list of timed events) with Score function,
and access them with `sequence` property:

```js
s = Score('c/8 e/8 d4 g4');
s.sequence; // => an array of events
```

It uses [melody-parser](http://github.com/danigb/melody-parser) and [measure-parser](http://github.com/danigb/measure-parser) to convert from
string to an array of event objects.

The events are simply objects in the form of `{ value: '', position: 0, duration: 0 }`

Given a sequence you can manipulate them chaining methods:

```js
  Score('a b c').reverse().delay(100);
```

The same of above can be written in a more declarative manner:

```js
Score('a b c', { reverse: true, delay: 100 });
```

## API

#### Score(source [, time] [, transfom]);

Create a score object. Basically is an array of events ordered by time position
with a time signature.

An optional time argument to specify the time signature ("4/4" by default)

An optional transform parameter allows to make simple or complex transformations
to the score. Since events are intended to be immutable, you need Score.event to
change event values. See `score.transform` for more documentation:

```js
var s1 = new Score("a b c", "3/4", function(event) {
  return Score.event(event, { type: 'note'});
});
```

Instead of a function, you can pass an object to build more complex
transformations:

```js
var s2 = new Score("a b c", "3/4", { reverse: true, repeat: 4 });
```

`new Score(...)` and `Score(...)` are equivalents.

#### Score.event(source, properties [, properties ...])

Clone or create an event object from a source and merge some properties. An event
object is any object with __at least__ three properties: value, position and
duration. By default, position and duration are 0:

```js
var event = Score.event('d#4'); // => { value: "d#4", position: 0, duration: 0 }
var cloned = Score.event(event); // => { value: "d#4", position: 0, duration: 0 }
event === cloned // => false
```

You can pass one or more hashes with properties to be merged with:

```js
var event = Score.event('c2', { duration: 0.5, type: 'note' }); // =>
// { value: 'c2', position: 0, duration: 0.5, type: 'note' }
```

The main purpose of this function is clone events and merge properties:

```js
var e1 = Score.event('Cm7');
var e2 = Score.event(e1, { type: 'chord', intervals: ['P1', 'm3', 'P5', 'm7']});
```

You can use Score.event inside score.transform function to add new events:


#### Score.merge(s1, s2, ...)

Create a new score with the result of merge s1, s2, ... scores.

#### Score.concat(s1, s2, ...)

Create a new score with the result of join (sequentially) s1, s2 ... scores.

### Score object

The Score function returns a new Score instance.

#### score.time

The time signature of the score. "4/4" by default.

#### score.sequence

The sequence property give access to the array of events.

#### score.transform(transform)

Create a new score by applying a transformation. Since event objects are intended
to be immutable, you need Score.event to create mutated events:

```js
var a = Score('a b')
var b = a.transform(function(event) {
  return Score.event(event, { value: event.value.toUpperCase() });
});
```
You can __remove events__ by returning null or undefined:

```js
Score('a b c', function(event) {
  if(event.value === 'b') return null;
  else return event;
}); // this creates a score with TWO events ('b' is removed)
```

Also, you can add __add events__ if you wrap them inside an array:

```js
Score('a b', function(event) {
  return [event, Score.event(event, { position: event.position + 10 })];
}); // score events values are: ['a', 'b', 'a', 'b']
```

## Core plugins

This are the plugins installed in the default Score object. All the methods are
available unless other thing is specified.

### Time

Time related methods:

#### score.duration()

Returns the total duration of the score.

#### repeat(times)

Repeat the score `times` times:
```js
Score('a b').repeat(3); // => values: ['a', 'b', 'a', 'b', 'a', 'b']
```

#### delay(duration)

Add the given duration to the position of all score events:
```js
Score('a b').delay(2); // => durations [2, 2.25]
```

### Selection

Create new scores using from a subset of events.

#### region(begin, end)

Returns a new score with the events between `begin` and `end`

### Musical

Music related methods.

#### transpose(interval)

Transpose all the notes by an interval:
```js
Score('a b c').transpose('M2'); // => values: ['b' 'c#', 'd']
```

## Extensions

This are the plugins not installed by default. You can install them using
`use` static method of Score:

```js
Score.use(require('scorejs/ext/<plugin_name>'));
```

### Builder plugin

Create complex scores using a declarative way:

```js
  // install the plugin.
  Score.use(require('scorejs/ext/builder'));

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
