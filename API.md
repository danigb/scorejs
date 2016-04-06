## `chord`

Create a collection of simultaneus notes

You can specify a collection of pitches, durations and attributes
and `chord` will arrange them as a collection of notes in simultaneus
layout

### Parameters

* `pitches` **`String or Array`** the chord note pitches
* `durations` **`String or Array`** the chord note durations
* `attributes` **`Hash`** the chord note attributes


### Examples

```js
score.phrase('A B C D E', 1)
```

Returns `Array` a parallel musical structure


## `chords`

Create a chord names sequence

### Parameters

* `meter` **`String`** the meter used in the measures
* `measures` **`String`** the chords
* `a` **`Sequence`** sequence of chords


### Examples

```js
score.chords('4/4', 'C6 | Dm7 G7 | Cmaj7')
```
```js
score(['chords', '4/4', 'Cmaj7 | Dm7 G7'])
```



## `el`

Create a score element: an object with duration

It's accepts any data you supply, but duration property has a special
meaning: it's a number representing the duration in arbitrary units.
It's assumed to be 0 (no duration) if not present or not a valid number

### Parameters

* `duration` **`Number`** the element duration
* `data` **`Object`** the additional element data





## `events`

Get a sorted events array from a score






## `expandChords`

Convert a chord names sequence into a chord notes sequence






## `forEachTime`

Get all notes for side-effects

__Important:__ ascending time ordered is not guaranteed

### Parameters

* `fn` **`Function`** the function
* `ctx` **`Object`** (Optional) a context object passed to the function
* `score` **`Score`** the score object





## `harmony`

Create a harmony sequence






## `ioi`

Create a rhythmic sequence from an inter onset interval number






## `ioiToPattern`

Convert an [inter onset interval](https://en.wikipedia.org/wiki/Time_point#Interonset_interval)
to a pattern

### Parameters

* `ioi` **`String`** the inter onset interval
* `the` **`String`** rhythm pattern





## `isArray`








## `map`

Map the notes of a musical structure using a function

### Parameters

* `fn` **`Function`** the function used to map the notes
* `ctx` **`Object`** a context object passed to the function
* `score` **`Score`** the score to transform



Returns `Score` the transformed score


## `measures`

Parse masures using a time meter to get a sequence

### Parameters

* `meter` **`String`** the time meter
* `measures` **`String`** the measures string
* `builder` **`Function`** (Optional) the function used to build the notes


### Examples

```js
measures('4/4', 'c d (e f) | g | (a b c) d')
```

Returns `Score` the score object


## `note`

Create a note from duration and pitch

A note is any object with duration and pitch attributes. The duration
must be a number, but the pitch can be any value (although only strings with
scientific notation pitches and midi numbers are recogniced by the manipulation
or display functions)

If only duration is provided, a partially applied function is returned.

### Parameters

* `duration` **`Integer`** the note duration
* `pitch` **`String or Integer`** the note pitch
* `data` **`Hash`** (Optional) arbitraty note data


### Examples

```js
score.note(1, 'A') // => { duration: 1, pitch: 'A' }
score.note(0.5, 'anything') // => { duration: 0.5, pitch: 'anything' }
score.note(2, 'A', 2, { inst: 'piano' }) // => { duration: 2, pitch: 'A', inst: 'piano' }
```
```js
// partially applied
['C', 'D', 'E'].map(score.note(1)) // => [{ duration: 1, pitch: 'C'},
  { duration: 1, pitch: 'D'}, { duration: 1, pitch: 'E'}]
```

Returns `Hash` a note


## `notes`








## `pattern`

Create a rhythmic sequence from a pattern






## `patternToIoi`

Convert a pattern string to inter onset interval string

### Parameters

* `pattern` **`String`** the pattern to be converted



Returns `String` the inter onset interval


## `phrase`

Create a phrase (a sequential structure of notes)

### Parameters

* `pitches` **`String or Array`** the phrase note pitches
* `durations` **`String or Array`** the phrase note durations
* `attributes` **`Hash`** the phrase note attributes


### Examples

```js
score.phrase('A B C D E', 1)
```

Returns `Array` a sequential musical structure


## `rhythm`








## `seq`

Create a musical structure where elements are sequenetial

### Parameters

* `elements` **`Array`** an array of elements


### Examples

```js
score.sequential([score.note('A'), score.note('B')])
```

Returns `Array` the sequential musical structure


## `sim`

Create a musical structure where elements are simultaneous



### Examples

```js
score.sim([score.note('A'), score.note('B')])
```



## `trans`

Transpose notes

### Parameters

* `interval` **`String`** the interval to transpose
* `score` **`Object`** the score object



Returns `Score` the score with the notes transposed


## `transform`

Transform a musical structure

This is probably the most important function. It allows complex
transformations of musical structures using three functions

### Parameters

* `elTransform` **`Function`** element transform function
* `seqTransform` **`Function`** sequential structure transform function
* `parTransform` **`Function`** simultaneous structure transform function
* `ctx` **`Any`** an additional object passed to transform functions
* `score` **`Object`** the score to transform



Returns  the result of the transformation


