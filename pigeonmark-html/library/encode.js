const build = require('./build-html')

/**
 * Given a JsonML element, or a string, render it to a HTML string, suitably escaped and structured
 * @param {string|Array} element
 * @returns {string}
 */
module.exports = function encode (element) {
  return [...build.any(element)].join('')
}
