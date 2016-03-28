
module.exports = function (score) {
  /**
   * Get all notes for side-effects
   *
   * __Important:__ ascending time ordered is not guaranteed
   *
   * @param {Function} fn - the function
   * @param {Score} score - the score object
   * @param {Object} ctx - (Optional) a context object passed to the function
  */
  score.forEachTime = function (fn, obj, ctx) {
    if (arguments.length > 1) return score.forEachTime(fn)(obj, ctx)
    return function (obj, ctx) {
      return score.transform(
        function (note) {
          return function (time, ctx) {
            fn(time, note, ctx)
            return note.duration
          }
        },
        function (seq) {
          return function (time, ctx) {
            return seq.reduce(function (dur, fn) {
              return dur + fn(time + dur, ctx)
            }, 0)
          }
        },
        function (par) {
          return function (time, ctx) {
            return par.reduce(function (max, fn) {
              return Math.max(max, fn(time, ctx))
            }, 0)
          }
        }
      )(obj)(0, ctx)
    }
  }
}
