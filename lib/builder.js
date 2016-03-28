
module.exports = function () {
  var build = function (data) {
    var fn = build[data[0]]
    if (!fn) throw Error('Command not found: "' + data[0] + '"')
    var params = data.slice(1).map(function (p) {
      return Array.isArray(p) ? build(p) : p
    })
    return fn.apply(null, params)
  }
  build.use = function () {
    var modules = Array.prototype.slice.call(arguments)
    modules.forEach(function (m) { Object.assign(build, m) })
  }
  return build
}
