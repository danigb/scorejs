
/**
 * Create a sequence from a list of values and durations
 *
 * @param {String|Array} values - the array of values (the string is splitted by space)
 */
function sequence (values, duration) {
  if (typeof values === 'string') values = values.split(' ')
  else if (!Array.isArray(values)) values = [ values ]
  duration = duration || 'q'

  return values.map(function (value) {
  })
}

module.exports = sequence
