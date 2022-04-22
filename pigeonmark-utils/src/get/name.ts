import type { PMTag, PMXMLPI } from '../types'
import getType from './type.js'

/**
 * returns the tag name of the node passed in, returns string if input type is supported, or undefined if it isn't
 */
export function name (node: PMTag | PMXMLPI): string {
  const type = getType(node)
  if (type === 'tag') {
    return node[0]
  } else if (type === 'pi') {
    return node[0].slice(1)
  } else {
    throw new Error('input is not a tag or xmlpi')
  }
}

export default name
