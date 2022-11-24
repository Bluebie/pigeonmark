import type { PMChildNode, PMRootNode } from '../types'
import { isFragment, isDocument, isTagWithAttributes, isTagWithoutAttributes } from '../get/type.js'

/**
 * copies a given tag, replacing it's child nodes
 * @param {PMRootNode} node
 * @param {PMChildNode[]} children
 * @returns {PMRootNode} - same node, for chaining
 */
export function childNodes (node: PMRootNode, children: PMChildNode[]): PMRootNode {
  if (isTagWithAttributes(node) || isDocument(node)) {
    node.splice(2, node.length - 2, ...children)
  } else if (isTagWithoutAttributes(node) || isFragment(node)) {
    node.splice(1, node.length - 1, ...children)
  } else {
    throw new Error('can only set children on tag, document, and fragment nodes')
  }

  return node
}

export default childNodes