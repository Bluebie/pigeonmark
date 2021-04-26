/**
 * @typedef {Object} PMAttributes - xml tag attributes
 * @typedef {[tag: string, ...children: PMChildNode[]]} PMTagWithoutAttributes - xml tag, without attributes
 * @typedef {[tag: string, attrs: PMAttributes, ...children: PMChildNode[]]} PMTagWithAttributes - xml tag, with attributes
 * @typedef {PMTagWithAttributes|PMTagWithoutAttributes} PMTag - xml tag, with or without attributes
 * @typedef {string} PMText - xml text node
 * @typedef {['#cdata-section', ...text: string[]]} PMCData - xml CDATA block
 * @typedef {['#comment', ...text: string[]]} PMComment - xml comment
 * @typedef {PMTag|PMCData|PMComment|PMText} PMChildNode - any type which can be a child of a tag, document, or fragment
 * @typedef {[name: string, attrs: PMAttributes]} PMXMLPI - xml processing instruction
 * @typedef {['#document', { doctype: string|undefined }, ...children: PMChildNode[]]} PMHTMLDocument - html root document container
 * @typedef {['#document', { doctype: string|undefined, pi: PMXMLPI[]|undefined }, ...children: PMChildNode[]]} PMXMLDocument - html root document container
 * @typedef {PMXMLDocument|PMHTMLDocument} PMDocument - either a html or xml document root
 * @typedef {['#document-fragment', ...children: PMChildNode[]]} PMFragment - XML document fragment container, used to group several root level tags and texts together
 * @typedef {PMTag|PMText|PMFragment|PMDocument} PMRootNode
 * @typedef {PMTag|PMAttributes|PMText|PMCData|PMComment|PMXMLPI|PMHTMLDocument|PMFragment} PMNode
 */

const typeLabels = {
  '#document': 'document',
  '#cdata-section': 'cdata',
  '#comment': 'comment',
  '#document-fragment': 'fragment'
}

/**
 * Check if an object is strictly plausibly an attributes object
 * @param {PMAttributes|*} obj
 * @returns {boolean}
 */
function isAttrs (obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false

  for (const key in obj) {
    if (typeof key !== 'string' || key.includes(' ')) return false
    if (typeof obj[key] !== 'string') return false
  }

  return true
}

exports.get = {
  /**
   * given a node, returns type string, one of 'tag', 'cdata', 'comment', 'doctype', 'pi', 'text', 'document' or 'fragment'
   * or returns undefined if the node doesn't seem to be interperable as PigeonMark
   * @param {PMRootNode|PMChildNode|*} node
   * @returns {'tag'|'cdata'|'comment'|'doctype'|'pi'|'text'|'document'|'fragment'|undefined}
   */
  type (node) {
    if (Array.isArray(node)) {
      if (node.length > 0) {
        if (typeof node[0] === 'string' && node[0].length > 0 && !node[0].includes(' ')) {
          const name = node[0]
          // handle special node types
          if (name.startsWith('#')) return typeLabels[name] // it's a dom type
          if (name.startsWith('?')) return 'pi' // it's one of those <?xml...?> sort of PIs
          if (name === '!DOCTYPE') return 'doctype'

          if (node.every((v, i) => Array.isArray(v) || typeof v === 'string' || (i === 1 && isAttrs(v)))) {
            return 'tag'
          }
        }
      }
    } else if (typeof node === 'string') {
      return 'text'
    } else if (node && typeof node === 'object' && isAttrs(node)) {
      return 'attributes'
    }
  },

  /**
   * returns the tag name of the node passed in, returns string if input type is supported, or undefined if it isn't
   * @param {PMTag|PMXMLPI} node
   * @returns {string|undefined}
   */
  name (node) {
    const type = exports.get.type(node)
    if (type === 'tag') {
      return node[0]
    } else if (type === 'pi') {
      return node[0].slice(1)
    }
  },

  /**
   * get attribute value from tag node, or undefined if the attribute isn't set or the tag doesn't have attributes
   * @param {PMTag|PMXMLPI} node - tag node
   * @param {string} attributeName - string attribute name
   * @returns {string|undefined}
   */
  attribute (node, attributeName) {
    if (Array.isArray(node) && typeof node[0] === 'string' && typeof node[1] === 'object' && !Array.isArray(node[1])) {
      return node[1][attributeName]
    }
  },

  /**
   * returns child elements or undefined if the input isn't a tag
   * @param {PMRootNode} node
   * @returns {PMTag[]|undefined}
   */
  children (node) {
    if (['tag', 'document', 'fragment'].includes(exports.get.type(node))) {
      return node.filter((value, index) => index > 0 && exports.get.type(value) === 'tag')
    }
  },

  /**
   * returns all child nodes of a tag, document, or fragment, or undefined if the input isn't a tag
   * @param {Array} node
   * @returns {Array[]}
   */
  childNodes (node) {
    if (['tag', 'document', 'fragment'].includes(exports.get.type(node))) {
      if (isAttrs(node[1])) return node.slice(2)
      else return node.slice(1)
    }
  },

  /**
   * shortcut to read id attribute, always returns a string, empty if no id is set
   * @param {PMTag} node
   * @returns {string|undefined}
   */
  id (node) {
    return exports.get.attribute(node, 'id')
  },

  /**
   * shortcut to read class attribute, always returns a string, empty if no id is set
   * @param {Array} node
   * @returns {string}
   */
  classList (node) {
    const string = exports.get.attribute(node, 'class') || ''
    if (string.trim() === '') {
      return []
    } else {
      return string.split(/ +/)
    }
  },

  /**
   * like WebAPI Element.textContent, returns a concatinated string of all the text and cdata nodes within this node
   * @param {Array} node
   * @returns {string}
   */
  text (node) {
    const type = exports.get.type(node)

    if (type === 'text') {
      return node
    } else if (type === 'cdata') {
      return node.slice(1).join('')
    } else if (type === 'comment') {
      return node.slice(1).join('')
    } else if (type === 'pi') {
      return node.slice(1).join('')
    } else {
      function * iter (input) {
        const kids = exports.get.childNodes(input)
        for (const kid of (kids || [])) {
          const kidType = exports.get.type(kid)
          if (kidType === 'text') {
            yield kid
          } else if (kidType === 'cdata') {
            yield * kid.slice(1)
          } else {
            yield * iter(kid)
          }
        }
      }
      return [...iter(node)].join('')
    }
  }
}
