import type { PMTag, PMXMLPI } from '../types'
import { isTag, isProcessingInstruction } from '../get/type.js'

/**
 * sets the name of a tag or xmlpi
 */
export function name (node: PMTag | PMXMLPI, name: string): PMTag | PMXMLPI {
  if (isTag(node)) {
    node[0] = name
  } else if (isProcessingInstruction(node)) {
    /** @ts-ignore */
    node[0] = `?${name}`
  } else {
    throw new Error('Not a tag or xmlpi')
  }
  return node
}

export default name