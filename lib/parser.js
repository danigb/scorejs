'use strict';

var event = require('./event.js');

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
    parseList(time, events, list, position, length);
    position += length;
  });
  return events;
}

function parseList(time, events, list, position, duration) {
  var evt;
  var duration = Math.floor(duration / list.length);
  list.forEach(function(item) {
    if (Array.isArray(item)) {
      parseList(time, events, item, position, duration);
    } else {
      evt = parseEvent(time, item, position, duration);
      events.push(evt);
    }
    position += evt.duration;
  });
}

var ITEM = /^([^/]+)(\/\d*)$/
function parseEvent(time, item, position, duration) {
  var match;
  var value = item;
  if((match = ITEM.exec(item))) {
    value = match[1];
    duration = time.ticks(+match[2].substring(1));
  }
  return event({ value: value, position: position, duration: duration});
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
