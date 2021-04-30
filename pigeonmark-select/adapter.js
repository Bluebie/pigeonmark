/**
 * @module pigeonmark-select-adapter
 */
const utils = require('pigeonmark-utils')

const parentMap = new WeakMap()

exports.isTag = (node) => utils.get.type(node) === 'tag'

exports.existsOne = function existsOne (test, nodes) {
  return nodes.some(function (node) {
    return exports.isTag(node) ? test(node) || existsOne(test, exports.getChildren(node)) : false
  })
}

exports.getSiblings = (node) => {
  const parent = exports.getParent(node)
  const sibs = parent ? utils.get.childNodes(parent) : [node]
  for (const sibling of sibs) parentMap.set(sibling, parent)
  return sibs
}

exports.getChildren = (node) => {
  const kids = utils.get.childNodes(node)
  for (const kid of kids) parentMap.set(kid, node)
  return kids
}

exports.getParent = (node) => parentMap.get(node)

exports.getAttributeValue = (node, attribute) => utils.get.attribute(node, attribute)

exports.hasAttrib = (node, attribute) => utils.get.attribute(node, attribute) !== undefined

function * walkParents (node) {
  let parent = exports.getParent(node)
  while (parent !== undefined) {
    yield parent
    parent = exports.getParent(parent)
  }
}

// remove any nodes who descend from other nodes that are already in the nodes array
exports.removeSubsets = (nodes) => {
  return nodes.filter(node => {
    for (const parent of walkParents(node)) {
      if (nodes.includes(parent)) return false
    }
    return true
  })
}

exports.getName = (node) => utils.get.name(node).toLowerCase()

function * walkChildren (node) {
  const type = utils.get.type(node)
  if (type === 'tag') yield node

  if (['tag', 'fragment', 'document'].includes(type)) {
    for (const child of utils.get.children(node)) {
      parentMap.set(child, node)
      yield * walkChildren(child)
    }
  }
}

exports.findOne = (test, nodes) => {
  for (const node of nodes) {
    for (const tag of walkChildren(node)) {
      if (test(tag)) return tag
    }
  }
}

exports.findAll = (test, nodes) => {
  const result = []
  for (const node of nodes) {
    for (const tag of walkChildren(node)) {
      if (test(tag)) result.push(tag)
    }
  }
  return result
}

exports.getText = (node) => utils.get.text(node)
