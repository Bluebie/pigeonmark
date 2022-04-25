import type { Adapter, Predicate } from 'css-select/lib/types'
import type { PMChildNode, PMTag } from 'pigeonmark-utils'
import utils from 'pigeonmark-utils'

const parentMap = new WeakMap()

export function isTag (node: PMChildNode): node is PMTag {
  return utils.get.isTag(node)
}

export function existsOne (test: Predicate<PMTag>, nodes: PMChildNode[]): boolean {
  return nodes.some(function (node) {
    return isTag(node) ? test(node) || existsOne(test, getChildren(node)) : false
  })
}

export function getSiblings (node: PMChildNode): PMChildNode[] {
  // can't work on text nodes, but it doesn't seem to break things...
  if (!isTag(node)) return []
  const parent = getParent(node)
  const sibs: PMChildNode[] = parent ? utils.get.childNodes(parent) : [node]
  for (const sibling of sibs) {
    if (typeof sibling !== 'string') parentMap.set(sibling, parent)
  }
  return sibs
}

export function getChildren (node: PMChildNode): PMChildNode[] {
  if (typeof node !== 'string') {
    const kids = utils.get.childNodes(node)
    for (const kid of kids) {
      if (typeof kid !== 'string') parentMap.set(kid, node)
    }
    return kids
  } else {
    return []
  }
}

export function getParent (node: PMTag): PMTag {
  return parentMap.get(node)
}

export function getAttributeValue (node: PMTag, attribute: string): string | undefined {
  return utils.get.attribute(node, attribute)
}

export function hasAttrib (node: PMTag, attribute: string): boolean {
  return attribute in utils.get.attributes(node)
}

function * walkParents (node: PMTag): Generator<PMTag> {
  let parent = getParent(node)
  while (parent !== undefined) {
    yield parent
    parent = getParent(parent)
  }
}

// remove any nodes who descend from other nodes that are already in the nodes array
export function removeSubsets (nodes: PMChildNode[]): PMChildNode[] {
  return nodes.filter(node => {
    if (isTag(node)) {
      for (const parent of walkParents(node)) {
        if (nodes.includes(parent)) return false
      }
    }
    return true
  })
}

export function getName (node: PMTag): string {
  return utils.get.name(node).toLowerCase()
}

function * walkChildren (node: PMTag): Generator<PMTag> {
  if (isTag(node)) yield node

  if (isTag(node) || utils.get.isFragment(node) || utils.get.isDocument(node)) {
    for (const child of utils.get.children(node)) {
      parentMap.set(child, node)
      yield * walkChildren(child)
    }
  }
}

export function findOne (test: Predicate<PMTag>, nodes: PMChildNode[]): PMTag | null {
  for (const node of nodes) {
    if (isTag(node)) {
      for (const tag of walkChildren(node)) {
        if (test(tag)) return tag
      }
    }
  }
  return null
}

export function findAll (test: Predicate<PMTag>, nodes: PMChildNode[]): PMTag[] {
  const result = []
  for (const node of nodes) {
    if (isTag(node)) {
      for (const tag of walkChildren(node)) {
        if (test(tag)) result.push(tag)
      }
    }
  }
  return result
}

export function getText (node: PMChildNode): string {
  return utils.get.text(node)
}

export const adapter:Adapter<PMChildNode, PMTag> = {
  isTag,
  existsOne,
  getSiblings,
  getChildren,
  getParent,
  getAttributeValue,
  hasAttrib,
  removeSubsets,
  getName,
  findOne,
  findAll,
  getText
}
