import type { PMTag, PMXMLPI } from '../types'
import setAttributes from './attributes.js'
import getAttributes from '../get/attributes.js'

/**
 * sets attribute value from tag node, or undefined if the attribute isn't set or the tag doesn't have attributes
 */
export function attribute (node: PMTag | PMXMLPI, attributeName: string, attributeValue: string): PMTag | PMXMLPI {
  const attributes = getAttributes(node)
  attributes[attributeName] = attributeValue
  return setAttributes(node, attributes)
}

export default attribute