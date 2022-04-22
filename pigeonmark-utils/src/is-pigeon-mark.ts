import type { PMNode } from './types'

export function isPigeonMark (node: PMNode): boolean {
  if (typeof node === 'string') {
    return true
  } else if (Array.isArray(node)) {
    const name = node[0]
    if (typeof name === 'string' && name.length > 0 && !name.includes(' ')) {
      if (node.length === 1) return true
      if (typeof node[1] === 'object' && !Array.isArray(node[1])) {
        // has attribs, check attribute name validity
        if (Object.keys(node[1]).some(attr => typeof attr !== 'string' || attr.match(/[ =]/))) return false // not a valid attribute name
        // check all the child nodes
        return node.every((child, index) => index <= 1 || isPigeonMark(child))
      } else {
        // no attributes object, so just check the children
        return node.every((child, index) => index === 0 || isPigeonMark(child))
      }
    }
  }
  return false
}

export default isPigeonMark