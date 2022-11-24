import type { PMNode } from '../types'
import { isText, isCData, isComment, isProcessingInstruction, isTag, isDocument, isFragment } from './type.js'
import getChildNodes from './child-nodes.js'

/**
 * like WebAPI Element.textContent, returns a concatinated string of all the text and cdata nodes within this node
 */
export function text (node: PMNode): string {
  if (isText(node)) {
    return node
  } else if (isCData(node)) {
    return node.slice(1).join('')
  } else if (isComment(node)) {
    return node.slice(1).join('')
  } else if (isProcessingInstruction(node)) {
    return node.slice(1).join('')
  } else {
    function * iter (input: PMNode): Generator<string> {
      if (isTag(input) || isDocument(input) || isFragment(input)) {
        for (const kid of getChildNodes(input)) {
          if (isText(kid) || isCData(kid)) {
            yield text(kid)
          } else {
            yield * iter(kid)
          }
        }
      }
    }
    return [...iter(node)].join('')
  }
}

export default text