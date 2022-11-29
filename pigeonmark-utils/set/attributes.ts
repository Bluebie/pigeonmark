import type { PMTag, PMXMLPI, PMAttributes } from '../types'
import { isProcessingInstruction, isTagWithAttributes, isTagWithoutAttributes } from '../get/type.js'

/**
 * sets all the attributes of a tag or xmlpi, or an empty object if it doesn't have any
 */
export function attributes (node: PMTag | PMXMLPI, object: PMAttributes): PMTag | PMXMLPI {
  if (isTagWithAttributes(node) || isProcessingInstruction(node)) {
    node[1] = object
  } else if (isTagWithoutAttributes(node)) {
    /** @ts-ignore */
    const name: string = node.shift()
    /** @ts-ignore */
    node.unshift(name, object)
  } else {
    throw new Error('invalid input')
  }

  return node
}

export default attributes