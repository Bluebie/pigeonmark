const CSSselect = require('css-select')
const adapter = require('./adapter')

/**
 * Find every tag that matches selector, returning an array of tags
 * @param {import('pigeonmark-utils').PMTag|import('pigeonmark-utils').PMDocument|import('pigeonmark-utils').PMFragment} tree
 * @param {string} selector
 * @returns {import('pigeonmark-utils').PMTag[]}
 */
exports.selectAll = function (tree, selector) {
  return CSSselect.selectAll(selector, tree, { adapter })
}

/**
 * Find one tag that matches the selector, or undefined if none match
 * @param {import('pigeonmark-utils').PMTag|import('pigeonmark-utils').PMDocument|import('pigeonmark-utils').PMFragment} tree
 * @param {string} selector
 * @returns {import('pigeonmark-utils').PMTag|undefined}
 */
exports.selectOne = function (tree, selector) {
  return CSSselect.selectOne(selector, tree, { adapter })
}

/**
 * Returns a boolean
 * @param {import('pigeonmark-utils').PMTag} element
 * @param {string} selector
 * @returns {boolean}
 */
exports.is = function (element, selector) {
  return CSSselect.is(element, selector, { adapter })
}

/**
 * Compile a selector in to a testing function
 * @param {string} selector
 * @returns {function}
 */
exports.compile = function (selector) {
  return CSSselect.compile(selector, { adapter })
}
