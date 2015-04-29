var vows = require('vows');
var assert = require('assert');

var $ = require('../lib/score.js');

vows.describe('Score').addBatch({
  "constructor" : {
    "score and options": function() {
      var s = $("a b", {title: "My title"});
      assert.equal(s.title, "My title");
      assert.equal(s.source, "a b");
    },
    "only score": function() {
      var s = $("a b");
      assert.equal(s.source, "a b");
    },
    "only options": function() {
      var s = $({title: 'My song'});
      assert.equal(s.title, 'My song');
      assert.equal(s.source, null);
    },
    "default options": function() {
      var s = $();
      assert.equal(s.tempo, "120");
      assert.notEqual(s.time, null);
    }
  },
  "parse": function() {
    var s = $("a b");
    assert.equal(s.dest.length, 2);
  }
}).export(module);
