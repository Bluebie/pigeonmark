const util = require('./index')

exports.isTag = (node) => util.get.type(node) === 'tag'
exports.tag = (node) => util.get.name(node)
exports.id = (node) => util.get.id(node) || ''
exports.className = (node) => util.get.attr(node, 'class') || ''
exports.attr = (node, attr) => util.get.attribute(node, attr)
exports.contents = (node) => util.get.text(node)

const nodeParents = new WeakMap()
exports.parent = (node) => nodeParents.get(node)

/**
 * internally map out the child parent relationships between everything
 * enabling .parent() to work after
 * @param {Array} node
 */
exports.scan = (node) => {
  const kids = util.get.children(node)
  if (kids && kids.length > 0) {
    for (const kid of kids) {
      if (!nodeParents.has(kid)) {
        nodeParents.set(kid, node)
        exports.scan(kid)
      }
    }
  }
}
