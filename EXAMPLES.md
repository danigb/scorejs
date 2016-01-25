
```js

var scorejs = require('scorejs')
var seq = scorejs.init([
  require('scorejs/modules/duration')
  require('scorejs/modules/melody')
  require('scorejs/modules/build')
  require('scorejs/modules/reverse')
  require('scorejs/modules/delay')
])
note = seq.event.note
rest = seq.event.rest



// create aseq
seq(null, ['C', 'D', 'E'].map(seq.event.note))
var a = seq(null, [note('C', 1), note('D', 0.5), note('E', 1/2), rest(2)])
seq.duration(a) //=> 4

// use a sequence parser
seq.melody('c d e g')
seq.
seq()
seq.chord('C')
seq(null, 'C D E', { reverse: true, delay: 100 })
seq.transform()
