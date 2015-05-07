/*
 * LODASH
 * We use only a subset of lodash. Make our own package.
 */
module.exports = {
  identity: require('lodash/utility/identity'),
  assign: require('lodash/object/assign'),
  compact: require('lodash/array/compact'),
  flatten: require('lodash/array/flatten'),
  identity: require('lodash/utility/identity'),
  sortBy: require('lodash/collection/sortBy'),
  filter: require('lodash/collection/filter')
}
