import type {
  PMAttributes, PMCData, PMComment, PMDocument, PMFragment, PMNode, PMTag, PMText,
  PMXMLPI, PMChildNode, PMTagWithAttributes, PMTagWithoutAttributes
} from '../types'

export function isTag (node: PMNode): node is PMTag {
  if (Array.isArray(node)) {
    if (node.length > 0 && typeof node[0] === 'string') {
      if (!node[0].startsWith('?') && !node[0].startsWith('#')) {
        return !node[0].includes(' ')
      }
    }
  }
  return false
}

export function isText (node: PMNode): node is PMText {
  return typeof node === 'string'
}

export function isAttributes (node: PMNode): node is PMAttributes {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return false

  for (const key in node) {
    if (typeof key !== 'string' || key.includes(' ')) return false
    if (typeof node[key] !== 'string') return false
  }

  return true
}

export function isComment (node: PMNode): node is PMComment {
  return (Array.isArray(node) && node.length > 0 && node[0] === '#comment')
}

export function isCData (node: PMNode): node is PMCData {
  return (Array.isArray(node) && node.length > 0 && node[0] === '#cdata-section')
}

export function isProcessingInstruction (node: PMNode): node is PMXMLPI {
  return (Array.isArray(node) && node.length > 0 && typeof node[0] === 'string' && node[0].startsWith('?'))
}

export function isDocument (node: PMNode): node is PMDocument {
  return (Array.isArray(node) && node.length > 0 && node[0] === '#document')
}

export function isFragment (node: PMNode): node is PMFragment {
  return (Array.isArray(node) && node.length > 0 && node[0] === '#document-fragment')
}

export function isChildNode (node: PMNode): node is PMChildNode {
  return isText(node) || isTag(node) || isCData(node) || isComment(node)
}

export function isTagWithAttributes (node: PMNode): node is PMTagWithAttributes {
  return isTag(node) && node.length > 1 && isAttributes(node[1])
}

export function isTagWithoutAttributes (node: PMNode): node is PMTagWithoutAttributes {
  return isTag(node) && node.length < 2 || !isAttributes(node[1])
}

/**
 * given a node, returns type string, one of 'tag', 'cdata', 'comment', 'doctype', 'pi', 'text', 'document' or 'fragment'
 * or returns undefined if the node doesn't seem to be interperable as PigeonMark
 */
export function type (node: PMNode): 'tag' | 'text' | 'attributes' | 'comment' | 'cdata' | 'pi' | 'document' | 'fragment' | undefined {
  if (isTag(node)) {
    return 'tag'
  } else if (isText(node)) {
    return 'text'
  } else if (isAttributes(node)) {
    return 'attributes'
  } else if (isDocument(node)) {
    return 'document'
  } else if (isComment(node)) {
    return 'comment'
  } else if (isCData(node)) {
    return 'cdata'
  } else if (isProcessingInstruction(node)) {
    return 'pi'
  } else if (isFragment(node)) {
    return 'fragment'
  }
}

export default type