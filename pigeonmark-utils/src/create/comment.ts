import type { PMComment } from '../types'

export function comment (text: string): PMComment {
  return ['#comment', text]
}

export default comment