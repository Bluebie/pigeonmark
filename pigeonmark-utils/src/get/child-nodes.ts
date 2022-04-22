import type { PMChildNode, PMDocument, PMFragment, PMTag } from '../types'
import { isTag, isDocument, isFragment, isTagWithAttributes } from './type.js'

/**
 * returns all child nodes of a tag, document, or fragment, or undefined if the input isn't a tag
 */
export function childNodes (node: PMTag | PMDocument | PMFragment): PMChildNode[] {
  if (isFragment(node)) {
    return node.slice(1)
  } else if (isDocument(node)) {
    /** @ts-ignore */
    return node.slice(2)
  } else if (isTag(node)) {
    if (isTagWithAttributes(node)) {
      /** @ts-ignore */
      return node.slice(2)
    } else {
      return node.slice(1)
    }
  }
  return []
}

export default childNodes