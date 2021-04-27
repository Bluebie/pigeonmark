const utils = require('pigeonmark-utils')
const xmlns = require('./xmlns')

const tags = 'true false null undefined number bigint object array map set string buffer'.split(' ')
/**
 * Check if a node is a pigeonmark:arbitrary document
 * @param {utils.PMNode} node - PigeonMark node
 * @returns {boolean}
 */
module.exports = function isArbitraryEncoded (node) {
  if (utils.isPigeonMark(node)) {
    const type = utils.get.type(node)
    if (type === 'document' || type === 'fragment') {
      return isArbitraryEncoded(utils.get.children(node)[0])
    } else if (type === 'tag') {
      if (utils.get.attribute(node, 'xmlns') !== xmlns) return false
      if (!tags.includes(utils.get.name(node))) return false
      return true
    }
  }
  return false
}
