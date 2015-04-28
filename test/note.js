var vows = require('vows');
var assert = require('assert');
var $ = require('../lib/note.js');

vows.describe('Note').addBatch({
  "parse string" : {
    "note name": function() {
      assert.equal($("c").name, 'c');
      assert.equal($("db").name, 'db');
    },
    "note accidentals": function() {
      assert.equal($('db').acc(), 'b');
    },
    "parse octaves": function() {
      assert.equal($('c').oct, 4);
      assert.equal($('c+').oct, 5);
      assert.equal($('c++').oct, 6);
      assert.equal($('c-').oct, 3);
      assert.equal($('c--').oct, 2);
    },
    "midi number": function() {
      assert.equal($('c').midi, 60);
      assert.equal($('d').midi, 62);
      assert.equal($('c+').midi, 72);
      assert.equal($('db').midi, 61);
      assert.equal($('dbb').midi, 60);
      assert.equal($('d#').midi, 63);
      assert.equal($('d##').midi, 64);
    }
  },
  "build from hash": {
    "name": function() {
      assert.equal($({name: 'C'}).str(), 'c');
      assert.equal($({name: 'C', oct: 5}).str(), 'c+');
      assert.equal($({name: 'C', oct: 7}).str(), 'c+++');
      assert.equal($({name: 'C', oct: 1}).str(), 'c---');
    }
  },
  "transpose": {
    "M2": function() {
      assert.equal($("c").t('M2'), "d");
      assert.equal($("c").t('P8'), "c+");
      assert.equal($("c").t('-P8'), "c-");
    },
    "m2": function() {
      assert.equal($("c").t('m2'), "db");
    }
  }
}).export(module);
