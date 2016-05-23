/** @module build */

function build (scope, data) {
  if (arguments.length > 1) return build(scope)(data)

  return function (data) {
    var ctx = {}
    ctx.score = exec(ctx, scope, data)
    return ctx
  }
}

// exec a data array
function exec (ctx, scope, data) {
  console.log('exec', ctx, scope, data)
  var fn = getFunction(ctx, scope, data[0])
  var elements = data.slice(1)
  var params = elements.map(function (p) {
    return Array.isArray(p) ? exec(ctx, scope, p)
      : (p[0] === '$') ? ctx[p] : p
  }).filter(function (p) { return p !== VAR })
  return fn.apply(null, params)
}

function getFunction (ctx, scope, name) {
  if (typeof name === 'function') return name
  else if (typeof name !== 'string') throw Error('Not a valid function: ' + name)
  else if (name[0] === '$') return variableFn(ctx, name)
  else if (!scope[name]) throw Error('Command not found: ' + name)
  else return scope[name]
}

var VAR = { type: 'var' }
function variableFn (ctx, name) {
  return function (obj) {
    ctx[name] = obj
    return VAR
  }
}

module.exports = { build: build }
