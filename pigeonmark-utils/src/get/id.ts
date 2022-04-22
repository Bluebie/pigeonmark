import type { PMTag } from '../types'
import getAttribute from './attribute.js'

/**
 * shortcut to read id attribute, always returns a string, empty if no id is set
 */
export function id (node: PMTag): string | undefined {
  return getAttribute(node, 'id')
}