import type { PMAttributes, PMTag, PMXMLPI } from '../types'

/**
 * get all the attributes of a tag or xmlpi, or an empty object if it doesn't have any
 */
export function attributes (node: PMTag | PMXMLPI): PMAttributes {
  if (Array.isArray(node) && typeof node[0] === 'string' && typeof node[1] === 'object' && !Array.isArray(node[1])) {
    return node[1]
  } else {
    return {}
  }
}

export default attributes