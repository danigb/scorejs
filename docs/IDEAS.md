# A notebook of ideas

I would like to have live coding programming. I imagine the score playing by
default (play/pause/goto)

```js
track markers pattern %start
merge markers stretch 12*measures pattern %A %B %A
loop kick pattern |x...|
goto @start
loop snare pattern |..x.|..xx|
part A chords |C|Dm|A7|F|C|
part B chords |Dm|Dm|Dm|Db7|
loop piano merge A B
rhythm piano


['loop', 'kick', ['pattern', '|x...|']]
['loop', 'kick', ['pattern', '|..x.|..xx|']]

score = score(function(score) {
  score('kick', 'pattern',  'x...x...x...x...').loop()
  score('snare', 'pattern', '..x...x...xx.x.x').loop()
  score('hihat', 'pattern', 'x.x.').loop()
}).play()

score('')
```
