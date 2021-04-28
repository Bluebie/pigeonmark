/**
 * Module providing interfaces necessary to use tree-selector
 * package to navigate JsonML/PigeonMark structures
 */
const util = require('./index')

/**
 * Check if a node is a <tag>
 * @param {util.PMNode} node
 * @returns {boolean}
 */
exports.isTag = (node) => util.get.type(node) === 'tag'

/**
 * Get the string name of a tag like <img> returns 'img'
 * @param {util.PMTag} node
 * @returns {string|undefined}
 */
exports.tag = (node) => util.get.name(node) || ''

/**
 * Get the string id value of a tag, or an empty string if it
 * doesn't have one
 * @param {util.PMTag} node
 * @returns {string}
 */
exports.id = (node) => util.get.id(node) || ''

/**
 * Get the space seperated string class list of a tag, or an empty
 * string if it doesn't have one
 * @param {util.PMTag} node
 * @returns {string}
 */
exports.className = (node) => exports.attr(node, 'class') || ''

/**
 * Get the string value of a tag's attribute, or undefined if it
 * isn't set
 * @param {util.PMTag} node
 * @param {string} attributeName
 * @returns {string|undefined}
 */
exports.attr = (node, attributeName) => util.get.attribute(node, attributeName)

/**
 * Get the child tags of an input tag
 * @param {util.PMRootNode} tag
 * @returns {util.PMTag[]}
 */
exports.children = (tag) => util.get.children(tag)

/**
 * Get the text contents of a node, like WebAPI DOM's textContent property
 * @param {util.PMNode} node
 * @returns {string}
 */
exports.contents = (node) => util.get.text(node)

const nodeParents = new WeakMap()

/**
 * Get the parent of a JsonML node. This only works if scan()
 * has been called on an ancestoral parent of this node
 * @param {util.PMNode} node
 * @returns {util.PMNode|undefined}
 */
exports.parent = (node) => nodeParents.get(node)

/**
 * Map out the structure of a JsonML/PigeonMark document,
 * allowing parent() to work correctly after
 * @param {util.PMNode} node
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
