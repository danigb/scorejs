/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';


	var Score = __webpack_require__(1)(
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(4),
	  __webpack_require__(5),
	  __webpack_require__(6)
	);

	module.exports = Score;

	if (typeof window !== 'undefined') window.Score = Score;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var identity = __webpack_require__(8);

	module.exports = function() {
	  /*
	  * Score
	  * =====
	  *
	  */
	  function Score(data) {
	    if (data instanceof Score) return source;
	    // Sugar part: if is a string or array, return a Sequence
	    if (!(this instanceof Score)) {
	      if (typeof(data) == 'string' || Array.isArray(data)) {
	        return new Score.Sequence(data);
	      } else {
	        return new Score(data);
	      }
	    }

	    // Copy data
	    this.data = {};
	    for(var name in (data || {})) {
	      this.data[name] = data[name];
	    }

	    // If data contains time, apply
	    this.time = Score.Sequence.Time(this.data.time || "4/4");
	    this.parts = {};
	  }

	  /*
	  * Parts
	  */
	  Score.prototype.part = function(name, source, proc) {
	    proc = proc || identity;
	    if(arguments.length == 1) {
	      var part = this.parts[name];
	      return part.proc(part.source);
	    }
	    var seq = new Score.Sequence(source, this.time);
	    seq.score = this;
	    this.parts[name] = { source: seq, proc: proc };
	    return this;
	  }

	  /*
	  * Plugin stuff
	  */
	  Score.Sequence = __webpack_require__(7)();
	  Score.fn = Score.Sequence.prototype;
	  Score.addPlugin = function(plugin) { plugin(Score); }

	  for(var i = 0; i < arguments.length; i++) {
	    Score.addPlugin(arguments[i]);
	  }

	  return Score;
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var last = __webpack_require__(10);
	var range = __webpack_require__(9);

	module.exports = function(Score) {

	  Score.fn.duration = function() {
	    var l = last(this.events);
	    return l ? (l.position + l.duration) : 0;
	  }

	  /*
	   * Repeat a sequence 'times' times
	   */
	  Score.fn.repeat = function(times) {
	    var duration = this.duration();
	    return this.map(function(event) {
	      return range(times).map(function(i) {
	        return event.clone({
	          position: event.position + i * duration
	        });
	      });
	    });
	  }

	  /*
	   * Delay
	   * Repeat each event
	   * Params:
	   * - distance: space between the event and the delayed event in ticks
	   * - repeat: number of delays (1 by default)
	   */
	  Score.fn.delay = function(distance, options) {
	    options = options || {};
	    options.repeat = options.repeat || 1;
	    options.distance = options.distance || distance;

	    return this.map(function(event) {
	      return range(options.repeat + 1).map(function(i) {
	        return event.clone({
	          position: event.position + i * options.distance
	        });
	      });
	    })
	  }

	  // measures(0, 1)

	  // select(begin, end)
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sortBy = __webpack_require__(11);

	module.exports = function(Score) {
	  /*
	   * MERGE
	   *
	   */
	  Score.fn.merge = function() {
	    if(arguments.length == 0) this;

	    var events = [].concat(this.events);

	    for(var i = 0; i < arguments.length; i++) {
	      var seq = arguments[i];
	      seq = this.score ? this.score.part(seq) : Score.Sequence(seq);
	      events = events.concat(seq.events);
	    }

	    return new Score.Sequence(sortBy(events, 'position'));
	  }
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var teoria = __webpack_require__(12);

	function plugin(Score) {
	  Score.Teoria = teoria;

	  Score.fn.transpose = function(interval) {
	    return this.map(function(e) {
	      if(typeof(e.value.interval) === "function") {
	        return e.clone({
	          value: e.value.interval(interval)
	        });
	      }
	    });
	  }

	  Score.fn.roots = function(duration) {
	    return this.map(function(e) {
	      if(typeof(e.value.root) !== "undefined") {
	        return e.clone({
	          value: e.value.root,
	          duration: (duration || e.duration),
	          type: 'note'
	        });
	      }
	    });
	  }

	  // decorate the parse method to parse notes and chords
	  var _parser = Score.Sequence.parse;
	  Score.Sequence.parse = function(time, repr) {
	    return strToTeoria(_parser(time, repr));
	  }

	  /*
	   * parse notes and chords
	   */
	  function strToTeoria(events) {
	    return events.map(function(event) {
	      var note, chord, val = event.value;

	      if((note = parseNote(val))) {
	        return event.clone({ value: note, type: 'note' });
	      } else if ((chord = parseChord(val))) {
	        return event.clone({ value: chord, type: 'chord' });
	      } else {
	        return event;
	      }
	    });
	  }

	  var NOTE = /^([a-h])(x|#|bb|b?)(-?\d*)$/
	  function parseNote(val) {
	    try {
	      if(NOTE.test(val)) return teoria.note(val);
	    } catch(e) {};
	    return null;
	  }
	  var CHORD = /^[A-H]/
	  function parseChord(val) {
	    try {
	      if(CHORD.test(val)) return teoria.chord(val);
	    } catch(e) {};
	    return null;
	  }
	}

	module.exports = plugin;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function($) {
	  $.fn.leftHandPiano = function(options) {
	    var options = options || {};
	    var inst = options.instrument || 'piano';
	    
	    return this.map(function(event) {
	      if(event.type == 'chord') {
	        return event.value.notes().map(function(note) {
	          return event.clone({
	            value: note, type: 'note',
	            fromChord: event.str(),
	            instrument: inst
	          });
	        });
	      }
	    });
	  }
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	var range = __webpack_require__(9);

	module.exports = function(Score) {
	  Score.fn.walkingBass = function() {
	    var time = this.time;
	    var duration = time.beat;
	    return this.roots().map(function(event) {
	      var times = event.duration / duration;
	      return range(times).map(function(i) {
	        return event.clone({
	          position: event.position + i * duration,
	          duration: duration
	        });
	      });
	    });
	  }
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Time = __webpack_require__(13);
	var Event = __webpack_require__(14);
	var compact = __webpack_require__(15);
	var flatten = __webpack_require__(16);
	var identity = __webpack_require__(8);
	var identity = __webpack_require__(8);
	var sortBy = __webpack_require__(11);
	var filter = __webpack_require__(17);

	module.exports = function() {
	  /*
	   * Sequence
	   * =====
	   *
	   */
	  function Sequence(source, time) {
	    if (source instanceof Sequence) return source;
	    if (!(this instanceof Sequence)) return new Sequence(source);

	    // If data contains time, apply
	    this.time = Sequence.Time(time || "4/4");
	    this.events = parseSource(this.time, source);
	  }

	  function parseSource(time, source) {
	    if(!source) {
	      return [];
	    } else if(Array.isArray(source)) {
	      return source.map(function(e) {
	        return Sequence.Event(e);
	      });
	    } else {
	      return Sequence.parse(time, source);
	    }
	  }

	  /*
	   * Static
	   */
	  Sequence.parse = __webpack_require__(18);
	  Sequence.Time = Time;
	  Sequence.Event = Event;

	  Sequence.fn = Sequence.prototype;

	  Sequence.fn.map = function(iter) {
	    iter = iter || identity;
	    var events = flatten(compact(this.events.map(iter)));
	    return new Sequence(sortBy(events, 'position'));
	  }

	  Sequence.fn.filter = function() {
	    var args = Array.prototype.slice.call(arguments); // Make real array from arguments
	    args.unshift(this.events);
	    return new Sequence(filter.apply(this, args));
	  }


	  Sequence.fn.toString = function() {
	    return this.events.map(function(e) { return e.str(); }).join(' ');
	  }

	  return Sequence;
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var isIterateeCall = __webpack_require__(19);

	/** Native method references. */
	var ceil = Math.ceil;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates an array of numbers (positive and/or negative) progressing from
	 * `start` up to, but not including, `end`. If `end` is not specified it is
	 * set to `start` with `start` then set to `0`. If `end` is less than `start`
	 * a zero-length range is created unless a negative `step` is specified.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {number} [start=0] The start of the range.
	 * @param {number} end The end of the range.
	 * @param {number} [step=1] The value to increment or decrement by.
	 * @returns {Array} Returns the new array of numbers.
	 * @example
	 *
	 * _.range(4);
	 * // => [0, 1, 2, 3]
	 *
	 * _.range(1, 5);
	 * // => [1, 2, 3, 4]
	 *
	 * _.range(0, 20, 5);
	 * // => [0, 5, 10, 15]
	 *
	 * _.range(0, -4, -1);
	 * // => [0, -1, -2, -3]
	 *
	 * _.range(1, 4, 0);
	 * // => [1, 1, 1]
	 *
	 * _.range(0);
	 * // => []
	 */
	function range(start, end, step) {
	  if (step && isIterateeCall(start, end, step)) {
	    end = step = null;
	  }
	  start = +start || 0;
	  step = step == null ? 1 : (+step || 0);

	  if (end == null) {
	    end = start;
	    start = 0;
	  } else {
	    end = +end || 0;
	  }
	  // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
	  // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
	  var index = -1,
	      length = nativeMax(ceil((end - start) / (step || 1)), 0),
	      result = Array(length);

	  while (++index < length) {
	    result[index] = start;
	    start += step;
	  }
	  return result;
	}

	module.exports = range;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}

	module.exports = last;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(20),
	    baseMap = __webpack_require__(21),
	    baseSortBy = __webpack_require__(22),
	    compareAscending = __webpack_require__(23),
	    isIterateeCall = __webpack_require__(19);

	/**
	 * Creates an array of elements, sorted in ascending order by the results of
	 * running each element in a collection through `iteratee`. This method performs
	 * a stable sort, that is, it preserves the original sort order of equal elements.
	 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
	 * (value, index|key, collection).
	 *
	 * If a property name is provided for `iteratee` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `iteratee` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `iteratee`.
	 * @returns {Array} Returns the new sorted array.
	 * @example
	 *
	 * _.sortBy([1, 2, 3], function(n) {
	 *   return Math.sin(n);
	 * });
	 * // => [3, 1, 2]
	 *
	 * _.sortBy([1, 2, 3], function(n) {
	 *   return this.sin(n);
	 * }, Math);
	 * // => [3, 1, 2]
	 *
	 * var users = [
	 *   { 'user': 'fred' },
	 *   { 'user': 'pebbles' },
	 *   { 'user': 'barney' }
	 * ];
	 *
	 * // using the `_.property` callback shorthand
	 * _.pluck(_.sortBy(users, 'user'), 'user');
	 * // => ['barney', 'fred', 'pebbles']
	 */
	function sortBy(collection, iteratee, thisArg) {
	  if (collection == null) {
	    return [];
	  }
	  if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
	    iteratee = null;
	  }
	  var index = -1;
	  iteratee = baseCallback(iteratee, thisArg, 3);

	  var result = baseMap(collection, function(value, key, collection) {
	    return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
	  });
	  return baseSortBy(result, compareAscending);
	}

	module.exports = sortBy;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint unused:false */

	//    Teoria.js
	//    http://saebekassebil.github.com/teoria
	//    Copyright Jakob Miland (saebekassebil)
	//    Teoria may be freely distributed under the MIT License.

	(function teoriaScope() {
	  'use strict';

	  var teoria = {};

	  function add(note, interval) {
	    return [note[0] + interval[0], note[1] + interval[1]];
	  }

	  function sub(note, interval) {
	    return [note[0] - interval[0], note[1] - interval[1]];
	  }

	  function mul(note, interval) {
	    if (typeof interval === 'number')
	      return [note[0] * interval, note[1] * interval];
	    else
	      return [note[0] * interval[0], note[1] * interval[1]];
	  }

	  function sum(coord) {
	    return coord[0] + coord[1];
	  }

	  // Note coordinates [octave, fifth] relative to C
	  var notes = {
	    c: [0, 0],
	    d: [-1, 2],
	    e: [-2, 4],
	    f: [1, -1],
	    g: [0, 1],
	    a: [-1, 3],
	    b: [-2, 5],
	    h: [-2, 5]
	  };

	  var intervals = {
	    unison: [0, 0],
	    second: [3, -5],
	    third: [2, -3],
	    fourth: [1, -1],
	    fifth: [0, 1],
	    sixth: [3, -4],
	    seventh: [2, -2],
	    octave: [1, 0]
	  };

	  var intervalFromFifth = ['second', 'sixth', 'third', 'seventh', 'fourth',
	                           'unison', 'fifth'];

	  var intervalsIndex = ['unison', 'second', 'third', 'fourth', 'fifth',
	                        'sixth', 'seventh', 'octave', 'ninth', 'tenth',
	                        'eleventh', 'twelfth', 'thirteenth', 'fourteenth',
	                        'fifteenth'];

	  // linaer index to fifth = (2 * index + 1) % 7
	  var fifths = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
	  var accidentals = ['bb', 'b', '', '#', 'x'];

	  var sharp = [-4, 7];
	  var A4 = add(notes.a, [4, 0]);

	  var kDurations = {
	    '0.25': 'longa',
	    '0.5': 'breve',
	    '1': 'whole',
	    '2': 'half',
	    '4': 'quarter',
	    '8': 'eighth',
	    '16': 'sixteenth',
	    '32': 'thirty-second',
	    '64': 'sixty-fourth',
	    '128': 'hundred-twenty-eighth'
	  };

	  var kQualityLong = {
	    P: 'perfect',
	    M: 'major',
	    m: 'minor',
	    A: 'augmented',
	    AA: 'doubly augmented',
	    d: 'diminished',
	    dd: 'doubly diminished'
	  };

	  var kAlterations = {
	    perfect: ['dd', 'd', 'P', 'A', 'AA'],
	    minor: ['dd', 'd', 'm', 'M', 'A', 'AA']
	  };

	  var kSymbols = {
	    'm': ['m3', 'P5'],
	    'mi': ['m3', 'P5'],
	    'min': ['m3', 'P5'],
	    '-': ['m3', 'P5'],

	    'M': ['M3', 'P5'],
	    'ma': ['M3', 'P5'],
	    '': ['M3', 'P5'],

	    '+': ['M3', 'A5'],
	    'aug': ['M3', 'A5'],

	    'dim': ['m3', 'd5'],
	    'o': ['m3', 'd5'],

	    'maj': ['M3', 'P5', 'M7'],
	    'dom': ['M3', 'P5', 'm7'],
	    'ø': ['m3', 'd5', 'm7'],

	    '5': ['P5']
	  };

	  var kChordShort = {
	    'major': 'M',
	    'minor': 'm',
	    'augmented': 'aug',
	    'diminished': 'dim',
	    'half-diminished': '7b5',
	    'power': '5',
	    'dominant': '7'
	  };

	  var kStepNumber = {
	    'unison': 1,
	    'first': 1,
	    'second': 2,
	    'third': 3,
	    'fourth': 4,
	    'fifth': 5,
	    'sixth': 6,
	    'seventh': 7,
	    'octave': 8,
	    'ninth': 9,
	    'eleventh': 11,
	    'thirteenth': 13
	  };

	  // Adjusted Shearer syllables - Chromatic solfege system
	  // Some intervals are not provided for. These include:
	  // dd2 - Doubly diminished second
	  // dd3 - Doubly diminished third
	  // AA3 - Doubly augmented third
	  // dd6 - Doubly diminished sixth
	  // dd7 - Doubly diminished seventh
	  // AA7 - Doubly augmented seventh
	  var kIntervalSolfege = {
	    'dd1': 'daw',
	    'd1': 'de',
	    'P1': 'do',
	    'A1': 'di',
	    'AA1': 'dai',
	    'd2': 'raw',
	    'm2': 'ra',
	    'M2': 're',
	    'A2': 'ri',
	    'AA2': 'rai',
	    'd3': 'maw',
	    'm3': 'me',
	    'M3': 'mi',
	    'A3': 'mai',
	    'dd4': 'faw',
	    'd4': 'fe',
	    'P4': 'fa',
	    'A4': 'fi',
	    'AA4': 'fai',
	    'dd5': 'saw',
	    'd5': 'se',
	    'P5': 'so',
	    'A5': 'si',
	    'AA5': 'sai',
	    'd6': 'law',
	    'm6': 'le',
	    'M6': 'la',
	    'A6': 'li',
	    'AA6': 'lai',
	    'd7': 'taw',
	    'm7': 'te',
	    'M7': 'ti',
	    'A7': 'tai',
	    'dd8': 'daw',
	    'd8': 'de',
	    'P8': 'do',
	    'A8': 'di',
	    'AA8': 'dai'
	  };

	  function pad(str, ch, len) {
	    for (; len > 0; len--) {
	      str += ch;
	    }

	    return str;
	  }

	  // teoria.note namespace - All notes should be instantiated
	  // through this function.
	  teoria.note = function(name, duration) {
	    if (typeof name === 'string')
	      return teoria.note.fromString(name, duration);
	    else
	      return new TeoriaNote(name, duration);
	  };

	  teoria.note.fromKey = function(key) {
	    var octave = Math.floor((key - 4) / 12);
	    var distance = key - (octave * 12) - 4;
	    var name = fifths[(2 * Math.round(distance / 2) + 1) % 7];
	    var note = add(sub(notes[name], A4), [octave + 1, 0]);
	    var diff = (key - 49) - sum(mul(note, [12, 7]));

	    return teoria.note(diff ? add(note, mul(sharp, diff)) : note);
	  };

	  teoria.note.fromFrequency = function(fq, concertPitch) {
	    var key, cents, originalFq;
	    concertPitch = concertPitch || 440;

	    key = 49 + 12 * ((Math.log(fq) - Math.log(concertPitch)) / Math.log(2));
	    key = Math.round(key);
	    originalFq = concertPitch * Math.pow(2, (key - 49) / 12);
	    cents = 1200 * (Math.log(fq / originalFq) / Math.log(2));

	    return { note: teoria.note.fromKey(key), cents: cents };
	  };

	  teoria.note.fromMIDI = function(note) {
	    return teoria.note.fromKey(note - 20);
	  };

	  teoria.note.fromString = function(name, dur) {
	    var scientific = /^([a-h])(x|#|bb|b?)(-?\d*)/i
	      , helmholtz = /^([a-h])(x|#|bb|b?)([,\']*)$/i
	      , parser, noteName, octave, accidental, note, lower;

	    // Try scientific notation first
	    parser = name.match(scientific);
	    if (parser && name === parser[0] && parser[3].length) {
	      noteName = parser[1];
	      octave = +parser[3];
	    } else {
	      name = name.replace(/\u2032/g, "'").replace(/\u0375/g, ',');

	      parser = name.match(helmholtz);
	      if (!parser || name !== parser[0])
	        throw new Error('Invalid note format');

	      noteName = parser[1];
	      octave = parser[3];
	      lower = noteName === noteName.toLowerCase();

	      if (!octave.length)
	        octave = lower ? 3 : 2;
	      else if (octave.match(/^'+$/) && lower)
	        octave = 3 + octave.length;
	      else if (octave.match(/^,+$/) && !lower)
	        octave = 2 - octave.length;
	      else
	        throw new Error('Format must respect the Helmholtz format');
	    }

	    accidental = parser[2].length ? parser[2].toLowerCase() : '';
	    noteName = noteName.toLowerCase();

	    note = [notes[noteName][0], notes[noteName][1]];
	    note = add(note, [octave, 0]);
	    note = add(note, mul(sharp, accidentals.indexOf(accidental) - 2));

	    return new TeoriaNote(sub(note, A4), dur);
	  };

	  // teoria.chord namespace - All chords should be instantiated
	  // through this function.
	  teoria.chord = function(name, symbol) {
	    if (typeof name === 'string') {
	      var root, octave;
	      root = name.match(/^([a-h])(x|#|bb|b?)/i);
	      if (root && root[0]) {
	        octave = typeof symbol === 'number' ? symbol.toString(10) : '4';
	        return new TeoriaChord(teoria.note(root[0].toLowerCase() + octave),
	                              name.substr(root[0].length));
	      }
	    } else if (name instanceof TeoriaNote)
	      return new TeoriaChord(name, symbol);

	    throw new Error('Invalid Chord. Couldn\'t find note name');
	  };

	  /**
	   * teoria.interval
	   *
	   * Sugar function for #from and #between methods, with the possibility to
	   * declare a interval by its string name: P8, M3, m7 etc.
	   */
	  teoria.interval = function(from, to) {
	    // Construct a TeoriaInterval object from string representation
	    if (typeof from === 'string')
	      return teoria.interval.toCoord(from);

	    if (typeof to === 'string' && from instanceof TeoriaNote)
	      return teoria.interval.from(from, teoria.interval.toCoord(to));

	    if (to instanceof TeoriaInterval && from instanceof TeoriaNote)
	      return teoria.interval.from(from, to);

	    if (to instanceof TeoriaNote && from instanceof TeoriaNote)
	      return teoria.interval.between(from, to);

	    throw new Error('Invalid parameters');
	  };

	  teoria.interval.toCoord = function(simple) {
	    var pattern = /^(AA|A|P|M|m|d|dd)(-?\d+)$/
	      , parser, number, coord, quality, lower, octaves, base, type, alt, down;

	    parser = simple.match(pattern);
	    if (!parser)
	      throw new Error('Invalid simple format interval');

	    quality = parser[1];
	    number = +parser[2];
	    down = number < 0;
	    number = down ? -number : number;

	    lower = number > 8 ? ((number % 7) ? number % 7 : 7) : number;
	    octaves = (number - lower) / 7;

	    base = intervals[intervalsIndex[lower - 1]];
	    coord = add(base, [octaves, 0]);

	    type = base[0] <= 1 ? 'perfect' : 'minor';
	    if ((type === 'perfect' && (quality === 'M' || quality === 'm')) ||
	        (type === 'minor' && quality === 'P')) {
	      throw new Error('Invalid interval quality');
	    }

	    alt = kAlterations[type].indexOf(quality) - 2;
	    coord = add(coord, mul(sharp, alt));
	    coord = down ? mul(coord, -1) : coord;

	    return new TeoriaInterval(coord);
	  };

	  /**
	   * Returns the note from a given note (from), with a given interval (to)
	   */
	  teoria.interval.from = function(from, to) {
	    return new TeoriaNote(add(from.coord, to.coord));
	  };

	  /**
	   * Returns the interval between two instances of teoria.note
	   */
	  teoria.interval.between = function(from, to) {
	    return new TeoriaInterval(sub(to.coord, from.coord));
	  };

	  teoria.interval.invert = function(sInterval) {
	    return teoria.interval(sInterval).invert().toString();
	  };

	  // teoria.scale namespace - Scales are constructed through this function.
	  teoria.scale = function(tonic, scale) {
	    if (!(tonic instanceof TeoriaNote))
	      tonic = teoria.note(tonic);

	    return new TeoriaScale(tonic, scale);
	  };

	  teoria.scale.scales = {};

	  function TeoriaNote(coord, duration) {
	    duration = duration || {};

	    this.duration = { value: duration.value || 4, dots: duration.dots || 0 };
	    this.coord = coord;
	  }

	  TeoriaNote.prototype = {
	    octave: function() {
	      return this.coord[0] + A4[0] - notes[this.name()][0] +
	        this.accidentalValue() * 4;
	    },

	    name: function() {
	      return fifths[this.coord[1] + A4[1] - this.accidentalValue() * 7 + 1];
	    },

	    accidentalValue: function() {
	      return Math.round((this.coord[1] + A4[1] - 2) / 7);
	    },

	    accidental: function() {
	      return accidentals[this.accidentalValue() + 2];
	    },

	    /**
	     * Returns the key number of the note
	     */
	    key: function(white) {
	      if (white)
	        return this.coord[0] * 7 + this.coord[1] * 4 + 29;
	      else
	        return this.coord[0] * 12 + this.coord[1] * 7 + 49;
	    },

	    /**
	    * Returns a number ranging from 0-127 representing a MIDI note value
	    */
	    midi: function() {
	      return this.key() + 20;
	    },

	    /**
	     * Calculates and returns the frequency of the note.
	     * Optional concert pitch (def. 440)
	     */
	    fq: function(concertPitch) {
	      concertPitch = concertPitch || 440;

	      return concertPitch *
	        Math.pow(2, (this.coord[0] * 12 + this.coord[1] * 7) / 12);
	    },

	    /**
	     * Returns the pitch class index (chroma) of the note
	     */
	    chroma: function() {
	      var value = (sum(mul(this.coord, [12, 7])) - 3) % 12;

	      return (value < 0) ? value + 12 : value;
	    },

	    /**
	     * Sugar function for teoria.scale(note, scale)
	     */
	    scale: function(scale) {
	      return teoria.scale(this, scale);
	    },

	    /**
	     * Sugar function for teoria.interval(note, interval)
	     */
	    interval: function(interval) {
	      return teoria.interval(this, interval);
	    },

	    /**
	     * Transposes the note, returned by TeoriaNote#interval
	     */
	    transpose: function(interval) {
	      var note = teoria.interval(this, interval);
	      this.coord = note.coord;

	      return this;
	    },

	    /**
	     * Returns a TeoriaChord object with this note as root
	     */
	    chord: function(chord) {
	      chord = (chord in kChordShort) ? kChordShort[chord] : chord;

	      return new TeoriaChord(this, chord);
	    },

	    /**
	     * Returns the Helmholtz notation form of the note (fx C,, d' F# g#'')
	     */
	    helmholtz: function() {
	      var octave = this.octave();
	      var name = this.name();
	      name = octave < 3 ? name.toUpperCase() : name.toLowerCase();
	      var padchar = octave < 3 ? ',' : '\'';
	      var padcount = octave < 2 ? 2 - octave : octave - 3;

	      return pad(name + this.accidental(), padchar, padcount);
	    },

	    /**
	     * Returns the scientific notation form of the note (fx E4, Bb3, C#7 etc.)
	     */
	    scientific: function() {
	      return this.name().toUpperCase() + this.accidental() + this.octave();
	    },

	    /**
	     * Returns notes that are enharmonic with this note.
	     */
	    enharmonics: function(oneaccidental) {
	      var key = this.key(), limit = oneaccidental ? 2 : 3;

	      return ['m3', 'm2', 'm-2', 'm-3']
	        .map(this.interval.bind(this))
	        .filter(function(note) {
	        var acc = note.accidentalValue();
	        var diff = key - (note.key() - acc);

	        if (diff < limit && diff > -limit) {
	          note.coord = add(note.coord, mul(sharp, diff - acc));
	          return true;
	        }
	      });
	    },

	    solfege: function(scale, showOctaves) {
	      if (!(scale instanceof TeoriaScale)) {
	        throw new Error('Invalid Scale');
	      }

	      var interval = scale.tonic.interval(this), solfege, stroke, count;
	      if (interval.direction() === 'down')
	        interval = interval.invert();

	      if (showOctaves) {
	        count = (this.key(true) - scale.tonic.key(true)) / 7;
	        count = (count >= 0) ? Math.floor(count) : -(Math.ceil(-count));
	        stroke = (count >= 0) ? '\'' : ',';
	      }

	      solfege = kIntervalSolfege[interval.simple(true).toString()];
	      return (showOctaves) ? pad(solfege, stroke, Math.abs(count)) : solfege;
	    },

	    /**
	     * Returns the name of the duration value,
	     * such as 'whole', 'quarter', 'sixteenth' etc.
	     */
	    durationName: function() {
	      return kDurations[this.duration.value];
	    },

	    /**
	     * Returns the duration of the note (including dots)
	     * in seconds. The first argument is the tempo in beats
	     * per minute, the second is the beat unit (i.e. the
	     * lower numeral in a time signature).
	     */
	    durationInSeconds: function(bpm, beatUnit) {
	      var secs = (60 / bpm) / (this.duration.value / 4) / (beatUnit / 4);
	      return secs * 2 - secs / Math.pow(2, this.duration.dots);
	    },

	    /**
	     * Returns the degree of this note in a given scale
	     * If the scale doesn't contain this note, the scale degree
	     * will be returned as 0 allowing for expressions such as:
	     * if (teoria.note('a').scaleDegree(teoria.scale('a', 'major'))) {
	     *   ...
	     * }
	     *
	     * as 0 evaluates to false in boolean context
	     **/
	    scaleDegree: function(scale) {
	      var inter = scale.tonic.interval(this);

	      // If the direction is down, or we're dealing with an octave - invert it
	      if (inter.direction() === 'down' ||
	         (inter.coord[1] === 0 && inter.coord[0] !== 0)) {
	        inter = inter.invert();
	      }

	      inter = inter.simple(true).coord;

	      return scale.scale.reduce(function(index, current, i) {
	        var coord = teoria.interval(current).coord;
	        return coord[0] === inter[0] && coord[1] === inter[1] ? i + 1 : index;
	      }, 0);
	    },

	    /**
	     * Returns the name of the note, with an optional display of octave number
	     */
	    toString: function(dont) {
	      return this.name() + this.accidental() + (dont ? '' : this.octave());
	    }
	  };


	  function TeoriaInterval(coord) {
	    this.coord = coord;
	  }

	  TeoriaInterval.prototype = {
	    name: function() {
	      return intervalsIndex[this.number() - 1];
	    },

	    semitones: function() {
	      return sum(mul(this.coord, [12, 7]));
	    },

	    number: function() {
	      return Math.abs(this.value());
	    },

	    value: function() {
	      var without = sub(this.coord,
	        mul(sharp, Math.floor((this.coord[1] - 2) / 7) + 1))
	        , i, val;

	      i = intervalFromFifth[without[1] + 5];
	      val = kStepNumber[i] + (without[0] - intervals[i][0]) * 7;

	      return (val > 0) ? val : val - 2;
	    },

	    type: function() {
	      return intervals[this.base()][0] <= 1 ? 'perfect' : 'minor';
	    },

	    base: function() {
	      var fifth = sub(this.coord, mul(sharp, this.qualityValue()))[1], name;
	      fifth = this.value() > 0 ? fifth + 5 : -(fifth - 5) % 7;
	      fifth = fifth < 0 ? intervalFromFifth.length + fifth : fifth;

	      name = intervalFromFifth[fifth];
	      if (name === 'unison' && this.number() >= 8)
	        name = 'octave';

	      return name;
	    },

	    direction: function(dir) {
	      if (dir) {
	        var is = this.value() >= 1 ? 'up' : 'down';
	        if (is !== dir)
	          this.coord = mul(this.coord, -1);

	        return this;
	      }
	      else
	        return this.value() >= 1 ? 'up' : 'down';
	    },

	    simple: function(ignore) {
	      // Get the (upwards) base interval (with quality)
	      var simple = intervals[this.base()];
	      simple = add(simple, mul(sharp, this.qualityValue()));

	      // Turn it around if necessary
	      if (!ignore)
	        simple = this.direction() === 'down' ? mul(simple, -1) : simple;

	      return new TeoriaInterval(simple);
	    },

	    isCompound: function() {
	      return this.number() > 8;
	    },

	    octaves: function() {
	      var without, octaves;

	      if (this.direction() === 'up') {
	        without = sub(this.coord, mul(sharp, this.qualityValue()));
	        octaves = without[0] - intervals[this.base()][0];
	      } else {
	        without = sub(this.coord, mul(sharp, -this.qualityValue()));
	        octaves = -(without[0] + intervals[this.base()][0]);
	      }

	      return octaves;
	    },

	    invert: function() {
	      var i = this.base();
	      var qual = this.qualityValue();
	      var acc = this.type() === 'minor' ? -(qual - 1) : -qual;
	      var coord = intervals[intervalsIndex[9 - kStepNumber[i] - 1]];
	      coord = add(coord, mul(sharp, acc));

	      return new TeoriaInterval(coord);
	    },

	    quality: function(lng) {
	      var quality = kAlterations[this.type()][this.qualityValue() + 2];

	      return lng ? kQualityLong[quality] : quality;
	    },

	    qualityValue: function() {
	      if (this.direction() === 'down')
	        return Math.floor((-this.coord[1] - 2) / 7) + 1;
	      else
	        return Math.floor((this.coord[1] - 2) / 7) + 1;
	    },

	    equal: function(interval) {
	        return this.coord[0] === interval.coord[0] &&
	            this.coord[1] === interval.coord[1];
	    },

	    greater: function(interval) {
	      var semi = this.semitones();
	      var isemi = interval.semitones();

	      // If equal in absolute size, measure which interval is bigger
	      // For example P4 is bigger than A3
	      return (semi === isemi) ?
	        (this.number() > interval.number()) : (semi > isemi);
	    },

	    smaller: function(interval) {
	      return !this.equal(interval) && !this.greater(interval);
	    },

	    add: function(interval) {
	      return new TeoriaInterval(add(this.coord, interval.coord));
	    },

	    toString: function(ignore) {
	      // If given true, return the positive value
	      var number = ignore ? this.number() : this.value();

	      return this.quality() + number;
	    }
	  };


	  function TeoriaChord(root, name) {
	    name = name || '';
	    this.name = root.name().toUpperCase() + root.accidental() + name;
	    this.symbol = name;
	    this.root = root;
	    this.intervals = [];
	    this._voicing = [];

	    var i, length, c, shortQ, parsing = 'quality', additionals = [],
	        notes = ['P1', 'M3', 'P5', 'm7', 'M9', 'P11', 'M13'],
	        chordLength = 2, bass, symbol, explicitMajor = false;

	    function setChord(intervals) {
	      for (var n = 0, chordl = intervals.length; n < chordl; n++) {
	        notes[n + 1] = intervals[n];
	      }

	      chordLength = intervals.length;
	    }

	    // Remove whitespace, commas and parentheses
	    name = name.replace(/[,\s\(\)]/g, '');
	    bass = name.split('/');
	    if (bass.length === 2) {
	      name = bass[0];
	      bass = bass[1];
	    } else {
	      bass = null;
	    }

	    for (i = 0, length = name.length; i < length; i++) {
	      if (!(c = name[i])) {
	        break;
	      }

	      switch (parsing) {
	        // Parses for the "base" chord, either a triad or a seventh chord
	        case 'quality':
	          var sub3 = (i + 2) < length ? name.substr(i, 3).toLowerCase() : null;
	          var sub2 = (i + 1) < length ? name.substr(i, 2).toLowerCase() : null;

	          if (sub3 in kSymbols)
	            symbol = sub3;
	          else if (sub2 in kSymbols)
	            symbol = sub2;
	          else if (c in kSymbols)
	            symbol = c;
	          else
	            symbol = '';

	          setChord(kSymbols[symbol]);

	          if (symbol === 'M' || symbol === 'ma' || symbol === 'maj')
	            explicitMajor = true;

	          i += symbol.length - 1;
	          parsing = 'extension';
	          break;

	        // Parses for the top interval or a pure sixth
	        case 'extension':
	          c = (c === '1' && name[i + 1]) ?
	            parseFloat(name.substr(i, 2)) : parseFloat(c);

	          if (!isNaN(c) && c !== 6) {
	            chordLength = (c - 1) / 2;

	            if (chordLength !== Math.round(chordLength)) {
	              throw new Error('Invalid interval extension: ' + c.toString(10));
	            }

	            // Special care for diminished chords
	            if (symbol === 'o' || symbol === 'dim') {
	              notes[3] = 'd7';
	            } else if (explicitMajor) {
	              notes[3] = 'M7';
	            }

	            i += String(c).length - 1;
	          } else if (c === 6) {
	            notes[3] = 'M6';
	            chordLength = (chordLength < 3) ? 3 : chordLength;
	          } else {
	            i -= 1;
	          }

	          parsing = 'alterations';
	          break;

	        // Parses for possible alterations of intervals (#5, b9, etc.)
	        case 'alterations':
	          var alterations = name.substr(i).split(/(#|b|add|maj|sus|M)/i),
	              next, flat = false, sharp = false;

	          if (alterations.length === 1) {
	            throw new Error('Invalid alterations');
	          } else if (alterations[0].length !== 0) {
	            throw new Error('Invalid token: \'' + alterations[0] + '\'');
	          }

	          for (var a = 1, aLength = alterations.length; a < aLength; a++) {
	            next = alterations[a + 1];

	            switch (alterations[a]) {
	            case 'M':
	            case 'Maj':
	            case 'maj':
	              chordLength = (chordLength < 3) ? 3 : chordLength;

	              if (next === '7') { // Ignore the seventh, that is already implied
	                a++;
	              }

	              notes[3] = 'M7';
	              break;

	            case 'Sus':
	            case 'sus':
	              var type = 'P4';
	              if (next === '2' || next === '4') {
	                a++;

	                if (next === '2') {
	                  type = 'M2';
	                }
	              }

	              notes[1] = type; // Replace third with M2 or P4
	              break;

	            case 'Add':
	            case 'add':
	              if (next && !isNaN(+next)) {
	                if (next === '9') {
	                  additionals.push('M9');
	                } else if (next === '11') {
	                  additionals.push('P11');
	                } else if (next === '13') {
	                  additionals.push('M13');
	                }

	                a += next.length;
	              }
	              break;

	            case 'b':
	              flat = true;
	              break;

	            case '#':
	              sharp = true;
	              break;

	            default:
	              if (alterations[a].length === 0) {
	                break;
	              }

	              var token = +alterations[a], quality, intPos;
	              if (isNaN(token) ||
	                  String(token).length !== alterations[a].length) {
	                throw new Error('Invalid token: \'' + alterations[a] + '\'');
	              }

	              if (token === 6) {
	                if (sharp) {
	                  notes[3] = 'A6';
	                } else if (flat) {
	                  notes[3] = 'm6';
	                } else {
	                  notes[3] = 'M6';
	                }

	                chordLength = (chordLength < 3) ? 3 : chordLength;
	                continue;
	              }

	              // Calculate the position in the 'note' array
	              intPos = (token - 1) / 2;
	              if (chordLength < intPos) {
	                chordLength = intPos;
	              }

	              if (token < 5 || token === 7 ||
	                  intPos !== Math.round(intPos)) {
	                throw new Error('Invalid interval alteration: ' + token);
	              }

	              quality = notes[intPos][0];

	              // Alterate the quality of the interval according the accidentals
	              if (sharp) {
	                if (quality === 'd') {
	                  quality = 'm';
	                } else if (quality === 'm') {
	                  quality = 'M';
	                } else if (quality === 'M' || quality === 'P') {
	                  quality = 'A';
	                }
	              } else if (flat) {
	                if (quality === 'A') {
	                  quality = 'M';
	                } else if (quality === 'M') {
	                  quality = 'm';
	                } else if (quality === 'm' || quality === 'P') {
	                  quality = 'd';
	                }
	              }

	              sharp = flat = false;
	              notes[intPos] = quality + token;
	              break;
	            }
	          }

	          parsing = 'ended';
	          break;
	      }

	      if (parsing === 'ended') {
	        break;
	      }
	    }

	    // Sixth-nine chord is an exception to the bass rule (e.g. C6/9)
	    if (bass && bass === '9') {
	      additionals.push('M9');
	      bass = null;
	    }

	    this.intervals = notes
	      .slice(0, chordLength + 1)
	      .concat(additionals)
	      .map(function(i) { return teoria.interval(i); });

	    for (i = 0, length = this.intervals.length; i < length; i++) {
	      this._voicing[i] = this.intervals[i];
	    }

	    if (bass) {
	      var intervals = this.intervals, bassInterval, note;
	      // Make sure the bass is atop of the root note
	      note = teoria.note(bass + (root.octave() + 1));

	      bassInterval = teoria.interval.between(root, note);
	      bass = bassInterval.simple();

	      bassInterval = bassInterval.invert();
	      bassInterval.direction('down');

	      this._voicing = [bassInterval];
	      for (i = 0; i < length; i++) {
	        if (intervals[i].simple().equal(bass))
	          continue;

	        this._voicing.push(intervals[i]);
	      }
	    }
	  }

	  TeoriaChord.prototype = {
	    notes: function() {
	      var voicing = this.voicing(), notes = [];

	      for (var i = 0, length = voicing.length; i < length; i++) {
	        notes.push(teoria.interval.from(this.root, voicing[i]));
	      }

	      return notes;
	    },

	    voicing: function(voicing) {
	      // Get the voicing
	      if (!voicing) {
	        return this._voicing;
	      }

	      // Set the voicing
	      this._voicing = [];
	      for (var i = 0, length = voicing.length; i < length; i++) {
	        this._voicing[i] = teoria.interval(voicing[i]);
	      }

	      return this;
	    },

	    resetVoicing: function() {
	      this._voicing = this.intervals;
	    },

	    dominant: function(additional) {
	      additional = additional || '';
	      return new TeoriaChord(this.root.interval('P5'), additional);
	    },

	    subdominant: function(additional) {
	      additional = additional || '';
	      return new TeoriaChord(this.root.interval('P4'), additional);
	    },

	    parallel: function(additional) {
	      additional = additional || '';
	      var quality = this.quality();

	      if (this.chordType() !== 'triad' || quality === 'diminished' ||
	          quality === 'augmented') {
	        throw new Error('Only major/minor triads have parallel chords');
	      }

	      if (quality === 'major') {
	        return new TeoriaChord(this.root.interval('m3', 'down'), 'm');
	      } else {
	        return new TeoriaChord(this.root.interval('m3', 'up'));
	      }
	    },

	    quality: function() {
	      var third, fifth, seventh, intervals = this.intervals;

	      for (var i = 0, length = intervals.length; i < length; i++) {
	        if (intervals[i].number() === 3) {
	          third = intervals[i];
	        } else if (intervals[i].number() === 5) {
	          fifth = intervals[i];
	        } else if (intervals[i].number() === 7) {
	          seventh = intervals[i];
	        }
	      }

	      if (!third) {
	        return;
	      }

	      third = (third.direction() === 'down') ? third.invert() : third;
	      third = third.simple().toString();

	      if (fifth) {
	        fifth = (fifth.direction === 'down') ? fifth.invert() : fifth;
	        fifth = fifth.simple().toString();
	      }

	      if (seventh) {
	        seventh = (seventh.direction === 'down') ? seventh.invert() : seventh;
	        seventh = seventh.simple().toString();
	      }

	      if (third === 'M3') {
	        if (fifth === 'A5') {
	          return 'augmented';
	        } else if (fifth === 'P5') {
	          return (seventh === 'm7') ? 'dominant' : 'major';
	        }

	        return 'major';
	      } else if (third === 'm3') {
	        if (fifth === 'P5') {
	          return 'minor';
	        } else if (fifth === 'd5') {
	          return (seventh === 'm7') ? 'half-diminished' : 'diminished';
	        }

	        return 'minor';
	      }
	    },

	    chordType: function() { // In need of better name
	      var length = this.intervals.length, interval, has, invert, i, name;

	      if (length === 2) {
	        return 'dyad';
	      } else if (length === 3) {
	        has = {first: false, third: false, fifth: false};
	        for (i = 0; i < length; i++) {
	          interval = this.intervals[i];
	          invert = interval.invert();
	          if (interval.base() in has) {
	            has[interval.base()] = true;
	          } else if (invert.base() in has) {
	            has[invert.base()] = true;
	          }
	        }

	        name = (has.first && has.third && has.fifth) ? 'triad' : 'trichord';
	      } else if (length === 4) {
	        has = {first: false, third: false, fifth: false, seventh: false};
	        for (i = 0; i < length; i++) {
	          interval = this.intervals[i];
	          invert = interval.invert();
	          if (interval.base() in has) {
	            has[interval.base()] = true;
	          } else if (invert.base() in has) {
	            has[invert.base()] = true;
	          }
	        }

	        if (has.first && has.third && has.fifth && has.seventh) {
	          name = 'tetrad';
	        }
	      }

	      return name || 'unknown';
	    },

	    get: function(interval) {
	      if (typeof interval === 'string' && interval in kStepNumber) {
	        var intervals = this.intervals, i, length;

	        interval = kStepNumber[interval];
	        for (i = 0, length = intervals.length; i < length; i++) {
	          if (intervals[i].number() === interval) {
	            return teoria.interval.from(this.root, intervals[i]);
	          }
	        }

	        return null;
	      } else {
	        throw new Error('Invalid interval name');
	      }
	    },

	    interval: function(interval) {
	      return new TeoriaChord(this.root.interval(interval), this.symbol);
	    },

	    transpose: function(interval) {
	      this.root.transpose(interval);
	      this.name = this.root.name().toUpperCase() +
	                  this.root.accidental() + this.symbol;

	      return this;
	    },

	    toString: function() {
	      return this.name;
	    }
	  };


	  function TeoriaScale(tonic, scale) {
	    var scaleName, i;

	    if (!(tonic instanceof TeoriaNote)) {
	      throw new Error('Invalid Tonic');
	    }

	    if (typeof scale === 'string') {
	      scaleName = scale;
	      scale = teoria.scale.scales[scale];
	      if (!scale)
	        throw new Error('Invalid Scale');
	    } else {
	      for (i in teoria.scale.scales) {
	        if (teoria.scale.scales.hasOwnProperty(i)) {
	          if (teoria.scale.scales[i].toString() === scale.toString()) {
	            scaleName = i;
	            break;
	          }
	        }
	      }
	    }

	    this.name = scaleName;
	    this.tonic = tonic;
	    this.scale = scale;
	  }

	  TeoriaScale.prototype = {
	    notes: function() {
	      var notes = [];

	      for (var i = 0, length = this.scale.length; i < length; i++) {
	        notes.push(teoria.interval(this.tonic, this.scale[i]));
	      }

	      return notes;
	    },

	    simple: function() {
	      return this.notes().map(function(n) { return n.toString(true); });
	    },

	    type: function() {
	      var length = this.scale.length - 2;
	      if (length < 8) {
	        return ['di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa'][length] +
	          'tonic';
	      }
	    },

	    get: function(i) {
	      i = (typeof i === 'string' && i in kStepNumber) ? kStepNumber[i] : i;

	      return this.tonic.interval(this.scale[i - 1]);
	    },

	    solfege: function(index, showOctaves) {
	      if (index)
	        return this.get(index).solfege(this, showOctaves);

	      return this.notes().map(function(n) {
	        return n.solfege(this, showOctaves);
	      });
	    },

	    interval: function(interval) {
	      return new TeoriaScale(this.tonic.interval(interval), this.scale);
	    },

	    transpose: function(interval) {
	      var scale = this.interval(interval);
	      this.scale = scale.scale;
	      this.tonic = scale.tonic;

	      return this;
	    }
	  };


	  teoria.scale.scales.ionian = teoria.scale.scales.major =
	    ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'];
	  teoria.scale.scales.dorian = ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'];
	  teoria.scale.scales.phrygian = ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'];
	  teoria.scale.scales.lydian = ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'];
	  teoria.scale.scales.mixolydian = ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'];
	  teoria.scale.scales.aeolian = teoria.scale.scales.minor =
	    ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'];
	  teoria.scale.scales.locrian = ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'];
	  teoria.scale.scales.majorpentatonic = ['P1', 'M2', 'M3', 'P5', 'M6'];
	  teoria.scale.scales.minorpentatonic = ['P1', 'm3', 'P4', 'P5', 'm7'];
	  teoria.scale.scales.chromatic = teoria.scale.scales.harmonicchromatic =
	    ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7'];


	  teoria.TeoriaNote = TeoriaNote;
	  teoria.TeoriaChord = TeoriaChord;
	  teoria.TeoriaScale = TeoriaScale;
	  teoria.TeoriaInterval = TeoriaInterval;

	  if (true) {
	    if (typeof module !== 'undefined' && module.exports)
	      exports = module.exports = teoria;

	    exports.teoria = teoria;
	  } else if (typeof this !== 'undefined')
	    this.teoria = teoria;
	  else if (typeof window !== 'undefined')
	    window.teoria = teoria;
	})();



/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function Time(timeKey, ticksPerBeat) {
	  if(timeKey instanceof Time) return timeKey;
	  if(!(this instanceof Time)) return new Time(timeKey, ticksPerBeat);

	  this.ticksPerBeat = ticksPerBeat | 96;

	  var split = timeKey.split('/');
	  this.beats = +split[0];
	  this.sub = +split[1];

	  // size of a beat in ticks
	  this.beat = this.ticksPerBeat;
	  // size of a measure in ticks
	  this.measure = this.beats * this.beat;
	  // sugar: 4 * this.measures;
	  this.measures = this.beats * this.beat;
	}

	Time.prototype.ticks = function(n) {
	  return (4 / n) * this.ticksPerBeat;
	}

	Time.prototype.for = function(dur, array) {
	    return array.map(function(num) { return num * dur });
	  }
	Time.prototype.forBeats = function(a) {
	    return this.for(this.beat, a);
	  }

	module.exports = Time;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = Event;

	/*
	 * EVENT
	 * =====
	 */
	function Event(obj) {
	  if (obj instanceof Event) return obj;
	  if (!(this instanceof Event)) return new Event(obj);
	  if (obj) Event.merge(this, obj);
	}

	Event.prototype.get = function(key) { return this[key]; }
	Event.prototype.str = function() { return (this.value || "").toString(); }

	/*
	 * Clone this event
	 */
	Event.prototype.clone = function(extra) {
	  var evt = new Event();
	  Event.merge(evt, this);
	  if(extra) Event.merge(evt, extra);
	  return evt;
	}

	Event.merge = function(target, obj) {
	 for (var i in obj) {
	  if (obj.hasOwnProperty(i)) {
	   target[i] = obj[i];
	  }
	 }
	 return target;
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Creates an array with all falsey values removed. The values `false`, `null`,
	 * `0`, `""`, `undefined`, and `NaN` are falsey.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to compact.
	 * @returns {Array} Returns the new array of filtered values.
	 * @example
	 *
	 * _.compact([0, 1, false, 2, '', 3]);
	 * // => [1, 2, 3]
	 */
	function compact(array) {
	  var index = -1,
	      length = array ? array.length : 0,
	      resIndex = -1,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (value) {
	      result[++resIndex] = value;
	    }
	  }
	  return result;
	}

	module.exports = compact;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var baseFlatten = __webpack_require__(24),
	    isIterateeCall = __webpack_require__(19);

	/**
	 * Flattens a nested array. If `isDeep` is `true` the array is recursively
	 * flattened, otherwise it is only flattened a single level.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isDeep] Specify a deep flatten.
	 * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	 * @returns {Array} Returns the new flattened array.
	 * @example
	 *
	 * _.flatten([1, [2, 3, [4]]]);
	 * // => [1, 2, 3, [4]]
	 *
	 * // using `isDeep`
	 * _.flatten([1, [2, 3, [4]]], true);
	 * // => [1, 2, 3, 4]
	 */
	function flatten(array, isDeep, guard) {
	  var length = array ? array.length : 0;
	  if (guard && isIterateeCall(array, isDeep, guard)) {
	    isDeep = false;
	  }
	  return length ? baseFlatten(array, isDeep) : [];
	}

	module.exports = flatten;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var arrayFilter = __webpack_require__(25),
	    baseCallback = __webpack_require__(20),
	    baseFilter = __webpack_require__(26),
	    isArray = __webpack_require__(27);

	/**
	 * Iterates over elements of `collection`, returning an array of all elements
	 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	 * invoked with three arguments: (value, index|key, collection).
	 *
	 * If a property name is provided for `predicate` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `predicate` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @alias select
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function|Object|string} [predicate=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `predicate`.
	 * @returns {Array} Returns the new filtered array.
	 * @example
	 *
	 * _.filter([4, 5, 6], function(n) {
	 *   return n % 2 == 0;
	 * });
	 * // => [4, 6]
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *
	 * // using the `_.matches` callback shorthand
	 * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
	 * // => ['barney']
	 *
	 * // using the `_.matchesProperty` callback shorthand
	 * _.pluck(_.filter(users, 'active', false), 'user');
	 * // => ['fred']
	 *
	 * // using the `_.property` callback shorthand
	 * _.pluck(_.filter(users, 'active'), 'user');
	 * // => ['barney']
	 */
	function filter(collection, predicate, thisArg) {
	  var func = isArray(collection) ? arrayFilter : baseFilter;
	  predicate = baseCallback(predicate, thisArg, 3);
	  return func(collection, predicate);
	}

	module.exports = filter;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var event = __webpack_require__(14);

	/*
	 * Parse
	 * =====
	 *
	 */
	function parse(time, repr) {
	  var events = [];
	  var position = 0;
	  var hasMeasureSplit = (repr.indexOf('|') >= 0);

	  splitMeasures(repr).forEach(function(measure) {
	    var list = parenthesize(tokenize(measure), []);
	    var length = hasMeasureSplit ?
	      time.measure : list.length * time.beat;
	    parseList(events, list, position, length);
	    position += length;
	  });
	  return events;
	}

	function parseList(events, list, position, duration) {
	  var duration = Math.floor(duration / list.length);
	  list.forEach(function(item) {
	    if (Array.isArray(item)) {
	      parseList(events, item, position, duration);
	    } else {
	      events.push(event({ value: item, position: position, duration: duration}));
	    }
	    position += duration;
	  });
	}

	function splitMeasures(repr) {
	  return repr
	    .replace(/\s+\||\|\s+/, '|') // spaces between |
	    .replace(/^\||\|\s*$/g, '') // first and last |
	    .split('|');
	}

	/*
	 * The following code is copied from https://github.com/maryrosecook/littlelisp
	 * See: http://maryrosecook.com/blog/post/little-lisp-interpreter
	 * Thanks Mary Rose Cook!
	 */
	var parenthesize = function(input, list) {
	  var token = input.shift();
	  if (token === undefined) {
	    return list;
	  } else if (token === "(") {
	    list.push(parenthesize(input, []));
	    return parenthesize(input, list);
	  } else if (token === ")") {
	    return list;
	  } else {
	    return parenthesize(input, list.concat(token));
	  }
	};

	var tokenize = function(input) {
	  return input.split('"')
	              .map(function(x, i) {
	                 if (i % 2 === 0) { // not in string
	                   return x.replace(/[\(\[\{]/g, ' ( ')
	                           .replace(/[\)\]\}]/g, ' ) ')
	                           .replace(/\|/g, ' ')
	                           .replace(/\,/g, ' ');
	                 } else { // in string
	                   return x.replace(/ /g, "!whitespace!");
	                 }
	               })
	              .join('"')
	              .trim()
	              .split(/\s+/)
	              .map(function(x) {
	                return x.replace(/!whitespace!/g, " ");
	              });
	};

	module.exports = parse;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(28),
	    isIndex = __webpack_require__(29),
	    isObject = __webpack_require__(30);

	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	      ? (isArrayLike(object) && isIndex(index, object.length))
	      : (type == 'string' && index in object)) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}

	module.exports = isIterateeCall;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(31),
	    baseMatchesProperty = __webpack_require__(32),
	    bindCallback = __webpack_require__(33),
	    identity = __webpack_require__(8),
	    property = __webpack_require__(34);

	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}

	module.exports = baseCallback;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(35),
	    isArrayLike = __webpack_require__(28);

	/**
	 * The base implementation of `_.map` without support for callback shorthands
	 * and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function baseMap(collection, iteratee) {
	  var index = -1,
	      result = isArrayLike(collection) ? Array(collection.length) : [];

	  baseEach(collection, function(value, key, collection) {
	    result[++index] = iteratee(value, key, collection);
	  });
	  return result;
	}

	module.exports = baseMap;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.sortBy` which uses `comparer` to define
	 * the sort order of `array` and replaces criteria objects with their
	 * corresponding values.
	 *
	 * @private
	 * @param {Array} array The array to sort.
	 * @param {Function} comparer The function to define sort order.
	 * @returns {Array} Returns `array`.
	 */
	function baseSortBy(array, comparer) {
	  var length = array.length;

	  array.sort(comparer);
	  while (length--) {
	    array[length] = array[length].value;
	  }
	  return array;
	}

	module.exports = baseSortBy;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var baseCompareAscending = __webpack_require__(36);

	/**
	 * Used by `_.sortBy` to compare transformed elements of a collection and stable
	 * sort them in ascending order.
	 *
	 * @private
	 * @param {Object} object The object to compare to `other`.
	 * @param {Object} other The object to compare to `object`.
	 * @returns {number} Returns the sort order indicator for `object`.
	 */
	function compareAscending(object, other) {
	  return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
	}

	module.exports = compareAscending;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(37),
	    isArray = __webpack_require__(27),
	    isArrayLike = __webpack_require__(28),
	    isObjectLike = __webpack_require__(38);

	/**
	 * The base implementation of `_.flatten` with added support for restricting
	 * flattening and specifying the start index.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isDeep] Specify a deep flatten.
	 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, isDeep, isStrict) {
	  var index = -1,
	      length = array.length,
	      resIndex = -1,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (isObjectLike(value) && isArrayLike(value) &&
	        (isStrict || isArray(value) || isArguments(value))) {
	      if (isDeep) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        value = baseFlatten(value, isDeep, isStrict);
	      }
	      var valIndex = -1,
	          valLength = value.length;

	      while (++valIndex < valLength) {
	        result[++resIndex] = value[valIndex];
	      }
	    } else if (!isStrict) {
	      result[++resIndex] = value;
	    }
	  }
	  return result;
	}

	module.exports = baseFlatten;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `_.filter` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array.length,
	      resIndex = -1,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[++resIndex] = value;
	    }
	  }
	  return result;
	}

	module.exports = arrayFilter;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var baseEach = __webpack_require__(35);

	/**
	 * The base implementation of `_.filter` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function baseFilter(collection, predicate) {
	  var result = [];
	  baseEach(collection, function(value, index, collection) {
	    if (predicate(value, index, collection)) {
	      result.push(value);
	    }
	  });
	  return result;
	}

	module.exports = baseFilter;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(39),
	    isNative = __webpack_require__(40),
	    isObjectLike = __webpack_require__(38);

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	module.exports = isArray;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(41),
	    isLength = __webpack_require__(39);

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	module.exports = isArrayLike;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = +value;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	module.exports = isIndex;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return type == 'function' || (!!value && type == 'object');
	}

	module.exports = isObject;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(42),
	    constant = __webpack_require__(43),
	    isStrictComparable = __webpack_require__(44),
	    keys = __webpack_require__(45),
	    toObject = __webpack_require__(46);

	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var props = keys(source),
	      length = props.length;

	  if (!length) {
	    return constant(true);
	  }
	  if (length == 1) {
	    var key = props[0],
	        value = source[key];

	    if (isStrictComparable(value)) {
	      return function(object) {
	        if (object == null) {
	          return false;
	        }
	        return object[key] === value && (value !== undefined || (key in toObject(object)));
	      };
	    }
	  }
	  var values = Array(length),
	      strictCompareFlags = Array(length);

	  while (length--) {
	    value = source[props[length]];
	    values[length] = value;
	    strictCompareFlags[length] = isStrictComparable(value);
	  }
	  return function(object) {
	    return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
	  };
	}

	module.exports = baseMatches;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(47),
	    baseIsEqual = __webpack_require__(48),
	    baseSlice = __webpack_require__(49),
	    isArray = __webpack_require__(27),
	    isKey = __webpack_require__(50),
	    isStrictComparable = __webpack_require__(44),
	    last = __webpack_require__(10),
	    toObject = __webpack_require__(46),
	    toPath = __webpack_require__(51);

	/**
	 * The base implementation of `_.matchesProperty` which does not which does
	 * not clone `value`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} value The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, value) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(value),
	      pathKey = (path + '');

	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === value
	      ? (value !== undefined || (key in object))
	      : baseIsEqual(value, object[key], null, true);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(8);

	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}

	module.exports = bindCallback;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(52),
	    basePropertyDeep = __webpack_require__(53),
	    isKey = __webpack_require__(50);

	/**
	 * Creates a function which returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}

	module.exports = property;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(54),
	    createBaseEach = __webpack_require__(55);

	/**
	 * The base implementation of `_.forEach` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array|Object|string} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object|string} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	module.exports = baseEach;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `compareAscending` which compares values and
	 * sorts them in ascending order without guaranteeing a stable sort.
	 *
	 * @private
	 * @param {*} value The value to compare to `other`.
	 * @param {*} other The value to compare to `value`.
	 * @returns {number} Returns the sort order indicator for `value`.
	 */
	function baseCompareAscending(value, other) {
	  if (value !== other) {
	    var valIsReflexive = value === value,
	        othIsReflexive = other === other;

	    if (value > other || !valIsReflexive || (value === undefined && othIsReflexive)) {
	      return 1;
	    }
	    if (value < other || !othIsReflexive || (other === undefined && valIsReflexive)) {
	      return -1;
	    }
	  }
	  return 0;
	}

	module.exports = baseCompareAscending;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(28),
	    isObjectLike = __webpack_require__(38);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
	}

	module.exports = isArguments;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var escapeRegExp = __webpack_require__(56),
	    isObjectLike = __webpack_require__(38);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  escapeRegExp(objToString)
	  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (objToString.call(value) == funcTag) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isNative;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(52);

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	module.exports = getLength;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(48);

	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} props The source property names to match.
	 * @param {Array} values The source values to match.
	 * @param {Array} strictCompareFlags Strict comparison flags for source values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	  var index = -1,
	      length = props.length,
	      noCustomizer = !customizer;

	  while (++index < length) {
	    if ((noCustomizer && strictCompareFlags[index])
	          ? values[index] !== object[props[index]]
	          : !(props[index] in object)
	        ) {
	      return false;
	    }
	  }
	  index = -1;
	  while (++index < length) {
	    var key = props[index],
	        objValue = object[key],
	        srcValue = values[index];

	    if (noCustomizer && strictCompareFlags[index]) {
	      var result = objValue !== undefined || (key in object);
	    } else {
	      result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (result === undefined) {
	        result = baseIsEqual(srcValue, objValue, customizer, true);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var getter = _.constant(object);
	 *
	 * getter() === object;
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	module.exports = constant;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(30);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	module.exports = isStrictComparable;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(28),
	    isNative = __webpack_require__(40),
	    isObject = __webpack_require__(30),
	    shimKeys = __webpack_require__(57);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object != null && object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	module.exports = keys;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(30);

	/**
	 * Converts `value` to an object if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}

	module.exports = toObject;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(46);

	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = -1,
	      length = path.length;

	  while (object != null && ++index < length) {
	    object = object[path[index]];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(58);

	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  // Exit early for identical values.
	  if (value === other) {
	    return true;
	  }
	  var valType = typeof value,
	      othType = typeof other;

	  // Exit early for unlike primitive values.
	  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
	      value == null || other == null) {
	    // Return `false` unless both values are `NaN`.
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}

	module.exports = baseIsEqual;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;

	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;

	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}

	module.exports = baseSlice;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(27),
	    toObject = __webpack_require__(46);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}

	module.exports = isKey;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(59),
	    isArray = __webpack_require__(27);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `value` to property path array if it is not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}

	module.exports = toPath;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(47),
	    toPath = __webpack_require__(51);

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}

	module.exports = basePropertyDeep;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(60),
	    keys = __webpack_require__(45);

	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(41),
	    isLength = __webpack_require__(39),
	    toObject = __webpack_require__(46);

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    var length = collection ? getLength(collection) : 0;
	    if (!isLength(length)) {
	      return eachFunc(collection, iteratee);
	    }
	    var index = fromRight ? length : -1,
	        iterable = toObject(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	module.exports = createBaseEach;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(59);

	/**
	 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
	 * In addition to special characters the forward slash is escaped to allow for
	 * easier `eval` use and `Function` compilation.
	 */
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	    reHasRegExpChars = RegExp(reRegExpChars.source);

	/**
	 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
	 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escapeRegExp('[lodash](https://lodash.com/)');
	 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
	 */
	function escapeRegExp(string) {
	  string = baseToString(string);
	  return (string && reHasRegExpChars.test(string))
	    ? string.replace(reRegExpChars, '\\$&')
	    : string;
	}

	module.exports = escapeRegExp;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(37),
	    isArray = __webpack_require__(27),
	    isIndex = __webpack_require__(29),
	    isLength = __webpack_require__(39),
	    keysIn = __webpack_require__(61),
	    support = __webpack_require__(62);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = shimKeys;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(63),
	    equalByTag = __webpack_require__(64),
	    equalObjects = __webpack_require__(65),
	    isArray = __webpack_require__(27),
	    isTypedArray = __webpack_require__(66);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (valWrapped || othWrapped) {
	      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	module.exports = baseIsEqualDeep;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Converts `value` to a string if it is not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  if (typeof value == 'string') {
	    return value;
	  }
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(67);

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(37),
	    isArray = __webpack_require__(27),
	    isIndex = __webpack_require__(29),
	    isLength = __webpack_require__(39),
	    isObject = __webpack_require__(30),
	    support = __webpack_require__(62);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keysIn;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to detect DOM support. */
	var document = (document = global.window) && document.document;

	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * An object environment feature flags.
	 *
	 * @static
	 * @memberOf _
	 * @type Object
	 */
	var support = {};

	(function(x) {
	  var Ctor = function() { this.x = x; },
	      args = arguments,
	      object = { '0': x, 'length': x },
	      props = [];

	  Ctor.prototype = { 'valueOf': x, 'y': x };
	  for (var key in new Ctor) { props.push(key); }

	  /**
	   * Detect if functions can be decompiled by `Function#toString`
	   * (all but Firefox OS certified apps, older Opera mobile browsers, and
	   * the PlayStation 3; forced `false` for Windows 8 apps).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcDecomp = /\bthis\b/.test(function() { return this; });

	  /**
	   * Detect if `Function#name` is supported (all but IE).
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  support.funcNames = typeof Function.name == 'string';

	  /**
	   * Detect if the DOM is supported.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.dom = document.createDocumentFragment().nodeType === 11;
	  } catch(e) {
	    support.dom = false;
	  }

	  /**
	   * Detect if `arguments` object indexes are non-enumerable.
	   *
	   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	   * checks for indexes that exceed the number of function parameters and
	   * whose associated argument values are `0`.
	   *
	   * @memberOf _.support
	   * @type boolean
	   */
	  try {
	    support.nonEnumArgs = !propertyIsEnumerable.call(args, 1);
	  } catch(e) {
	    support.nonEnumArgs = true;
	  }
	}(1, 0));

	module.exports = support;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length,
	      result = true;

	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Deep compare the contents, ignoring non-numeric properties.
	  while (result && ++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    result = undefined;
	    if (customizer) {
	      result = isLoose
	        ? customizer(othValue, arrValue, index)
	        : customizer(arrValue, othValue, index);
	    }
	    if (result === undefined) {
	      // Recursively compare arrays (susceptible to call stack limits).
	      if (isLoose) {
	        var othIndex = othLength;
	        while (othIndex--) {
	          othValue = other[othIndex];
	          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          if (result) {
	            break;
	          }
	        }
	      } else {
	        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	      }
	    }
	  }
	  return !!result;
	}

	module.exports = equalArrays;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} value The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        : object == +other;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(45);

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var skipCtor = isLoose,
	      index = -1;

	  while (++index < objLength) {
	    var key = objProps[index],
	        result = isLoose ? key in other : hasOwnProperty.call(other, key);

	    if (result) {
	      var objValue = object[key],
	          othValue = other[key];

	      result = undefined;
	      if (customizer) {
	        result = isLoose
	          ? customizer(othValue, objValue, key)
	          : customizer(objValue, othValue, key);
	      }
	      if (result === undefined) {
	        // Recursively compare objects (susceptible to call stack limits).
	        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
	      }
	    }
	    if (!result) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	module.exports = equalObjects;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(39),
	    isObjectLike = __webpack_require__(38);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}

	module.exports = isTypedArray;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(46);

	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;

	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ }
/******/ ]);