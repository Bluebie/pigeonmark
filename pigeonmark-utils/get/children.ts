import type { PMTag, PMDocument, PMFragment } from '../types'
import { isTag } from './type.js'
import childNodes from './child-nodes.js'

/**
 * returns child elements of a tag, fragment, or document
 */
export function children (node: PMTag | PMDocument | PMFragment): PMTag[] {
  return childNodes(node).filter(isTag)
}

export default children