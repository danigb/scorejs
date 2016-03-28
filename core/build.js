
module.exports = function build (ctx, data) {
  var fn = ctx[data[0]]
  if (!fn) throw Error('Command not found: "' + data[0] + '"')
  var params = data.slice(1).map(function (p) {
    return Array.isArray(p) ? build(ctx, p) : p
  })
  return fn.apply(null, params)
}
