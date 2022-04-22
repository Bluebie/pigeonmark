import type { PMChildNode, PMDocument } from '../types'
/**
 * Create a PigeonMark document
 */

export function document (options: PMDocument[1],  children: PMChildNode[]): PMDocument {
  return [`#document`, options || {}, ...children]
}

export default document