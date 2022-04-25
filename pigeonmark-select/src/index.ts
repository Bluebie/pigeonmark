import {
  selectAll as cssSelectAll,
  selectOne as cssSelectOne,
  is as cssIs,
  compile as cssCompile
} from 'css-select'
import type { PMDocument, PMFragment, PMTag } from 'pigeonmark-utils'
import utils from 'pigeonmark-utils'
import { adapter } from './adapter.js'

export type Tree = PMTag | PMDocument | PMFragment

/**
 * Find every tag that matches selector, returning an array of tags
 */
export function selectAll (tree: Tree, selector: string): PMTag[] {
  let searchTree: PMTag
  if (utils.get.isTag(tree)) {
    searchTree = tree
  } else {
    searchTree = ['root', ...utils.get.childNodes(tree)]
  }
  return cssSelectAll(selector, [searchTree], { adapter })
}

/**
 * Find one tag that matches the selector, or undefined if none match
 */
export function selectOne (tree: Tree, selector: string): PMTag | undefined {
  let searchTree: PMTag
  if (utils.get.isTag(tree)) {
    searchTree = tree
  } else {
    searchTree = ['root', ...utils.get.childNodes(tree)]
  }

  const result = cssSelectOne(selector, [searchTree], { adapter })
  if (result !== null) return result
}

/**
 * Returns a boolean
 */
export function is (element: PMTag, selector: string): boolean {
  return cssIs(element, selector, { adapter })
}

/**
 * Compile a selector in to a testing function
 */
export function compile (selector: string) {
  return cssCompile(selector, { adapter })
}

export default {
  selectOne,
  selectAll,
  is,
  compile
}