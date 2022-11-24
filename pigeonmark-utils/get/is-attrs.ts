import type { PMAttributes } from '../types'

/**
 * Check if an object is strictly plausibly an attributes object
 */
export function isAttrs (obj: PMAttributes | any): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false

  for (const key in obj) {
    if (typeof key !== 'string' || key.includes(' ')) return false
    if (typeof obj[key] !== 'string') return false
  }

  return true
}

export default isAttrs