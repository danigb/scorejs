var slice = Array.prototype.slice

function init () {
  var modules = slice.call(arguments)

  var build = function (data) {
    if (arguments.length > 1) data = build['sim'](slice.call(arguments))
    return exec({}, build, data)
  }

  build.score = build
  modules.forEach(function (m) { Object.assign(build, m) })
  return build
}

var VAR = { type: 'var' }
function exec (ctx, fns, data) {
  var elements, params
  var fnName = data[0]
  var fn = fns[fnName]

  if (fnName[0] === '$') {
    ctx[fnName] = exec(ctx, fns, data[1])
    return VAR
  } else if (!fn) {
    throw Error('Command not found: "' + fnName + '"')
  } else {
    elements = data.slice(1)
    params = elements.map(function (p) {
      return Array.isArray(p) ? exec(ctx, fns, p)
       : (p[0] === '$') ? ctx[p]
       : p
    }).filter(function (p) { return p !== VAR })
    return fn.apply(null, params)
  }
}

module.exports = { init: init }
