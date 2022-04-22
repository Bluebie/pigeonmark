import setChildNodes from './child-nodes.js'

/**
 * replaces child nodes of tag with specified children
 * @param {PMRootNode} node
 * @param {PMChildNode[]} children
 * @returns {PMRootNode} - same node, for chaining
 */
export const children = setChildNodes
export default setChildNodes