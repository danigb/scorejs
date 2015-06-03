'use strict'

module.exports = function (Score) {
  Score.build = function (data) {
    var obj, score = {}
    if (typeof data === 'string') {
      try {
        obj = JSON.parse(data)
      } catch (e) {
        obj = parseScore(data)
      }
    } else {
      obj = data
    }

    score.parts = buildParts(Score, obj.parts || {})
    merge(score, obj, 'parts')
    score.part = function (name, transform) {
      var part = score.parts[name]
      return part ? Score(score.parts[name], transform) : null
    }
    return score
  }
}

var IS_PART = /^\s*\[[^]*\]\s*$/
var MATCH_PART = /^\s*\[([a-zA-Z]+)\]\s*$/
var IS_ASSIGN = /^\s*[^=]+\s*=.*$/
var MATCH_ASSIGN = /^\s*([a-zA-Z]+)\s*=\s*(.*)$/
function parseScore (text) {
  var obj = { parts: {} }, matched, partName = null
  text.split(/\n/).forEach(function (line, index) {
    if (/^\s*$/.test(line)) return

    if (IS_PART.test(line)) {
      if ((matched = MATCH_PART.exec(line))) {
        partName = matched[1]
        obj.parts[partName] = ''
      } else {
        throw Error('Line ' + (index + 1) + ' Part name not valid: ' + line)
      }
    } else if (partName) {
      obj.parts[partName] = obj.parts[partName] + line
    } else {
      if (IS_ASSIGN.test(line)) {
        if ((matched = MATCH_ASSIGN.exec(line))) {
          obj[matched[1]] = matched[2].replace(/^["']/, '').replace(/["']$/, '')
        } else {
          throw Error('Line ' + (index + 1) + ' Assignment not valid: ' + line)
        }
      } else {
        throw Error('Line ' + (index + 1) + ' Syntax error: ' + line)
      }
    }
  })
  return obj
}

function buildParts (Score, parts) {
  var parsed = {}
  Object.keys(parts).forEach(function (name) {
    var part = parts[name]
    if (typeof part === 'string') {
      parsed[name] = Score(part)
    } else {
      var source = part.score
      var options = merge({}, part, 'score')
      parsed[name] = Score(source, options)
    }
  })
  return parsed
}

function merge (dest, src, skip) {
  for (var n in src) {
    if (n !== skip) {
      dest[n] = src[n]
    }
  }
  return dest
}
