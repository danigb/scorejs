
module.exports = function (score) {
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
