'use strict';

var time = require('./time.js')('4/4');
var parse = require('./parser.js');
/*
 * Score
 * =====
 *
 * Arguments:
 * - score: OPTIONAL, a string representing the score
 * - options: OPTIONAL, a hash with score._options
 *
 */
function Score(source, options) {
  if (!(this instanceof Score)) return new Score(source, options);

  if(source && typeof(source.score) == 'function') {
    source = source.score();
  } else if (typeof(source) != 'string') {
    options = source;
    source = null;
  }

  var score = [];

  // set options
  score._options = { tempo: 120, time: time };
  score.get = function(name) { return score._options[name]; }
  score.set = function(name, value) { score._options[name] = value; }

  // copy options
  options = options || {};
  Object.keys(options).forEach(function(key) {
    score.set(key, options[key])
  });

  // add plugins
  Object.keys(Score._plugins).forEach(function(name) {
    var plugin = Score._plugins[name];
    score[name] = function() {
      var iter = plugin.apply(null, arguments);
      if (iter) {
        return iter(score) || score;
      }
      return score;
    }
  });

  // set source and dest (score array)
  score.source = source;
  var parsed = parse(score._options.time, score.source);
  Array.prototype.push.apply(score, parsed);

  return score;
}

/*
 * PLUGINS
 */
Score._plugins = { "str": require('./plugins/to_string.js') };
Score.plugin = function(name, plugin) {
  Score._plugins[name] = plugin;
}

module.exports = Score;
