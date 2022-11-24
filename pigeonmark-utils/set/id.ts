import type { PMTag } from '../types'
import setAttribute from './attribute.js'

/**
 * shortcut to set id attribute of a tag
 */
export function id (node: PMTag, value: string): PMTag {
  return setAttribute(node, 'id', value)
}

export default id