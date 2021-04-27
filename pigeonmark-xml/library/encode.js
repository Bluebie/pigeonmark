const utils = require('pigeonmark-utils')
const esc = require('./escape')
const assert = require('assert')

function frequency (string, chars) {
  const frequencies = Object.fromEntries([...chars].map(x => [x, 0]))
  for (const char of `${string}`) {
    if (typeof frequencies[char] === 'number') frequencies[char] += 1
  }
  return frequencies
}

const builders = {
  * text (element) {
    yield esc(element, '<&')
  },

  * tag (element) {
    const tag = utils.get.name(element)
    const attrs = utils.get.attributes(element)
    const kids = utils.get.childNodes(element)
    assert(tag.match(/^[^\r\n\t. ?!#][^\r\n\t ?!#]*$/), 'tag name must not be empty, and cannot contain whitespace, ?, !, #, and cannot start with a period')

    if (kids.length > 0) {
      yield `<${tag}${[...builders.attributes(attrs)].join('')}>`
      for (const kid of kids) yield * build(kid)
      yield `</${tag}>`
    } else {
      yield `<${tag}${[...builders.attributes(attrs)].join('')}/>`
    }
  },

  * attributes (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      assert(name.match(/^[^\r\n\t ?!=]+$/gm), 'attribute name cannot contain whitespace, question marks, explanation marks, and must not be empty')
      const freq = frequency(value, '\'"')
      if (freq['"'] <= freq["'"]) {
        yield ` ${name}="${esc(value, '&>"')}"`
      } else {
        yield ` ${name}='${esc(value, "&>'")}'`
      }
    }
  },

  * comment (element) {
    yield `<!--${utils.get.text(element)}-->`
  },

  * cdata (element) {
    const text = utils.get.text(element)
    if (text.includes(']]>')) throw new Error('Cannot encode cdata block containing string "]]>" safely.')
    yield `<![CDATA[${text}]]>`
  },

  * document (element) {
    const attrs = utils.get.attributes(element)
    for (const pi of (attrs.xmlpi || [])) {
      yield * builders.pi(pi)
    }
    if (attrs.doctype) yield `<!DOCTYPE ${attrs.doctype}>\n`
    const children = utils.get.children(element)
    if (children.length === 1) {
      yield * builders.tag(children[0])
    } else if (children.length > 1) {
      throw new Error('XML documents cannot have multiple root tags')
    }
  },

  * fragment (element) {
    for (const childNode of utils.get.childNodes(element)) {
      yield * build(childNode)
    }
  },

  * pi (element) {
    const name = utils.get.name(element)
    const attrs = utils.get.attributes(element)
    yield `<?${name}${[...builders.attributes(attrs)].join('')}?>\n`
  }
}

function * build (element) {
  const type = utils.get.type(element)
  yield * builders[type](element)
}

module.exports = function encode (obj) {
  return [...build(obj)].join('')
}
