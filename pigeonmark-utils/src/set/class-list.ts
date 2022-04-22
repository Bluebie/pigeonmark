import type { PMTag } from '../types'
import setAttribute from './attribute.js'

/**
 * shortcut to read class attribute, always returns a string, empty if no id is set
 */
export function classList (node: PMTag, classList: string[] | string): PMTag {
  if (Array.isArray(classList)) classList = classList.join(' ')
  return setAttribute(node, 'class', `${classList}`)
}

export default classList