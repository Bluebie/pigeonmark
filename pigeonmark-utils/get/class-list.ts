import type { PMTag } from '../types'
import getAttribute from './attribute.js'

/**
 * shortcut to read class attribute, always returns a string, empty if no id is set
 */
export function classList (node: PMTag): string[] {
  const string = getAttribute(node, 'class') || ''
  if (string.trim() === '') {
    return []
  } else {
    return string.split(/ +/)
  }
}

export default classList