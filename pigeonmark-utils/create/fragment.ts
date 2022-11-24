import type { PMChildNode, PMFragment } from '../types'

/**
 * Create a PigeonMark document fragment
 */
export function fragment (children: PMChildNode[]): PMFragment {
  return [`#document-fragment`, ...children]
}

export default fragment