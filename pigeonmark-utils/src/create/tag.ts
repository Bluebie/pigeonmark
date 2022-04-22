import type { PMAttributes, PMChildNode, PMTagWithAttributes, PMTagWithoutAttributes, PMTag } from '../types'

export function tagWithoutAttributes(name: string, children: PMChildNode[]): PMTagWithoutAttributes {
  return [`${name}`, ...children]
}

export function tagWithAttributes(name: string, attributes: PMAttributes, children: PMChildNode[]): PMTagWithAttributes {
  return [`${name}`, { ...attributes }, ...children]
}

/**
 * Create a PigeonMark/JSONML Tag element
 */
export function tag (name: string, attributes: PMAttributes = {}, children: PMChildNode[] = []): PMTag {
  if (Object.keys(attributes).length === 0) {
    return tagWithoutAttributes(name, children)
  } else {
    return tagWithAttributes(name, attributes, children)
  }
}

export default tag