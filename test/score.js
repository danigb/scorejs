var vows = require('vows');
var assert = require('assert');

var $ = require('../lib/score.js');

vows.describe('Score').addBatch({
  "constructor" : {
    "score and options": function() {
      var s = $("a4 b4", {title: "My title"});
      assert.equal(s.get('title'), "My title");
      assert.equal(s.source, "a4 b4");
    },
    "only score": function() {
      var s = $("a4 b4");
      assert.equal(s.source, "a4 b4");
    },
    "only options": function() {
      var s = $({title: 'My song'});
      assert.equal(s.get('title'), 'My song');
      assert.equal(s.source, null);
    },
    "default options": function() {
      var s = $();
      assert.equal(s.get('tempo'), "120");
      assert.notEqual(s.get('time'), null);
    }
  },
  "parse score": function() {
    var s = $("a4 b4");
    assert.equal(s.length, 2);
    assert.equal(s[0].value, 'a')
    assert.equal(s[1].value, 'b')
  },
  "plugins": {
    "add plugin": function() {
      $.plugin("myPlugin", function() {});
      var s = $();
      assert.notEqual(s.myPlugin, null);
    },
    "invoke plugin": function() {
      var inv = 0;
      var plugin = function() { inv++; }
      $.plugin("myPlugin", plugin);
      $("a4").myPlugin();
      assert.equal(inv, 1);
    },
    "invoke iterator": function() {
      var plugin = function() {
        return function(events) {
          events.forEach(function(e) {
            e.value = e.value.toLowerCase();
          });
        }
      }
      $.plugin("lowerCase", plugin);
      var s = $("A B").lowerCase();
      assert.equal(s[0].value, "a");
      assert.equal(s[1].value, "b");
    }
  }
}).export(module);
