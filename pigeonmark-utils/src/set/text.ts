import type { PMRootNode } from '../types'
import { isText } from '../get/type.js'
import setChildNodes from './child-nodes.js'

/**
 * like WebAPI Element.textContent, replaces children of tag with a text node when set
 */
export function text (node: PMRootNode, text: string): PMRootNode {
  if (isText(node)) {
    throw new Error('Cannot change text contents of a text node, set text on parent tag')
  } else {
    return setChildNodes(node, [`${text}`])
  }
}

export default text