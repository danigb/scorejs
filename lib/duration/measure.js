'use strict'

/**
 * Get the measure duration
 *
 * @param {String} meter - the time meter
 * @return {Integer} the measure duration
 */
function measure (meter) {
  meter = meter.split('/')
  return +meter[0] / +meter[1]
}

module.exports = measure
