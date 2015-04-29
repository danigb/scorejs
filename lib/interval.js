
module.exports = Interval;

var INTERVALS = {
  "P1": 0, "d2": 0, "A1": 1, "m2": 1, "M2": 2, "d3": 2,
  "m3": 3, "A2": 3, "M3": 4, "d4": 4, "P4": 5, "A3": 5,
  "d5": 6, "A4": 6, "tritone": 6,
  "P5": 7, "d6": 7, "m6": 8, "a5": 8, "M6": 9, "d7": 9,
  "m7": 10, "A6": 10, "M7": 11, "d8": 11, "P8": 12, "A7": 12
};



var REGEX = /([-]{0,1})([PmMAd])(\d+)/
function Interval(arg) {
  if(arg instanceof Interval) return arg;
  if (!(this instanceof Interval)) return new Interval(arg);

  var m = REGEX.exec(arg);

  this.name = arg;
  this.direction = m[1] == '-' ? -1 : 1;
  this.quality = m[2];
  this.amount = +m[3] - 1;
  var simpleAmount = this.amount % 7;
  this.octaves = (this.amount - simpleAmount) / 7;
  this.simple = m[1] + this.quality + (simpleAmount + 1);
  this.semitones = this.direction * (INTERVALS[this.simple] + 12 * this.octaves);
}
