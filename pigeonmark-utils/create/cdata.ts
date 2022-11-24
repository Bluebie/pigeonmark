import type { PMCData } from '../types'

export function cdata (text: string): PMCData {
  return ['#cdata-section', text]
}

export default cdata