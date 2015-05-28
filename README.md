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

You can create sequences (ordered list of timed events) with ease:

   s = Score('c/8 e/8 d4 g4') => | c.e.d...g... |

Where the letter is the note and the /8 is the length of the note.

Given a sequence you can manipulate them chaining methods:

  s.reverse().delay(100);

There's a more declarative approach available too:

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


## Installation

    $ npm install scorejs

## How it works

ScoreJS provides a parser to convert string to sequences:

  Score("r4 a2/8 d2/8 e4 | c/2 ")

The parser uses | to create measures and /num to specify durations.

The parser returns a sequence: a time-ordered list of events. You can
alter the sequences using a chain of methods:

    Score("C | Dm G7 | C").measure(2).transpose('2M');

All the methods are implemented by plugins. Add new methods are very easy.



## API

## Plugins

## Build your own plugin

```js
// A plugin is a function with one parameter: the Score
module.exports = function(Score) {}

  // It adds method to Sequence using Score.fn
  Score.fn.delay = function(distance) {
    // we use map to transform the current Sequence into another
    return this.map(function(event) {
      return Score.event(event, { position: event.position + distance });
    });
  }
}
```

## License

The MIT License (MIT)
