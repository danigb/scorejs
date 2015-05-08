
module.exports = function(Score) {
  /*
   * ROOTS
   *
   * Map all chords to roots
   */
  Score.fn.roots = function(duration) {
    return this.map(function(e) {
      if(typeof(e.value.root) !== "undefined") {
        return e.clone({
          value: e.value.root,
          duration: (duration || e.duration),
          type: 'note',
          fromChord: e.value.toString()
        });
      }
    });
  }
}
