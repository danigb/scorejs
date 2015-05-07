# ScoreJS

Create and manipulate musical scores with javascript:

```js
  var score = require('scorejs');
  var melody = score('a b c d e f g').transpose('M2');
  var chords = score('Cmaj7 | Dm7 G7').leftHandPiano();
  chords.merge(melody).play({ tempo: 110 });
```

You can use a more declarative version:
```js
  score({
    title: "Ain't misbehavin'",
    parts: {
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
      }
    }
  });

  score.merge("melody", "piano", "bass").play( { tempo: 100 } );
```


## Installation

    $ npm install scorejs

## Usage

The core concept of ScoreJS library is the Sequence: a time-ordered list of
events. You can create a Sequence with:

    new Score.Sequence("a b c d");

or the surgar:

    Score("a b c d");

Then you can apply methods to the sequence:

    Score("C | Dm G7 | C").measure(2).transpose('2M');

All the methods are implemented by plugins. Extend the sequence object is
really easy.

## Plugins

## Build your own plugin

```js
// A plugin is a function with one parameter: the Score
module.exports = function(Score) {}

  // It adds method to Sequence using Score.fn
  Score.fn.delay = function(distance) {
    // we use map to transform the current Sequence into another
    return this.map(function(event) {
      // For each event, return the event and the delayed event
      return [event, event.set(position: event.position + distance)];
    });
  }
}
```

## License

The MIT License (MIT)
