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
  splitMeasures(repr).forEach(function(measure) {
    parseList(events, parenthesize(tokenize(measure), []), position, 1 * time.measure);
    position += 1 * time.measure;
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
