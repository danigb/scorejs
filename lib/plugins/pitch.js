
module.exports = function(Score) {
  
  Score.fn.transpose = function(interval) {
    return this.map(function(e) {
      if(typeof(e.value.interval) === "function") {
        return e.set('value', e.value.interval(interval));
      }
    });
  }
}
