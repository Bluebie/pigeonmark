import type { PMTag, PMXMLPI } from '../types'
import getAttributes from './attributes.js'

/**
 * get attribute value from tag node, or undefined if the attribute isn't set or the tag doesn't have attributes
 */
export function attribute (node: PMTag | PMXMLPI, attributeName: string): string | undefined {
  return getAttributes(node)[attributeName]
}

export default attribute