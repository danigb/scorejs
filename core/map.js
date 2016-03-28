
module.exports = function (score) {
  /**
  * Map the notes of a musical structure using a function
  *
  * @param {Function} fn - the function used to map the notes
  * @param {Score} score - the score to transform
  * @param {Object} ctx - (Optional) a context object passed to the function
  * @return {Score} the transformed score
  */
  score.map = function (nt, obj, ctx) {
    if (arguments.length > 1) return score.map(nt)(obj, ctx)
    return score.transform(nt, score.seq, score.par)
  }

  score.mapVal = function (name, nt, obj, ctx) {
    if (arguments.length > 2) return score.mapVal(name, nt)(obj, ctx)
    return score.map(function (obj) {
      var o = Object.assign(obj)
      o[name] = nt(o[name])
      return o
    })
  }

  score.with = function (attrs, obj) {
    if (arguments.length > 1) return score.with(attrs)(obj)
    return score.map(function (note) {
      return Object.assign({}, note, attrs)
    })
  }
}
