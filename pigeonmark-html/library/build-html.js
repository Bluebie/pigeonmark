const assert = require('assert')
const selfClosingTags = new Set(require('html-tags/void'))
const esc = require('./escape')
const utils = require('pigeonmark-utils')

function frequency (string, chars) {
  const frequencies = Object.fromEntries([...chars].map(x => [x, 0]))
  for (const char of `${string}`) {
    if (typeof frequencies[char] === 'number') frequencies[char] += 1
  }
  return frequencies
}

const build = module.exports = {
  * any (element) {
    const type = utils.get.type(element)
    const builder = build[type]
    if (!builder) throw new Error(`Cannot encode type ${JSON.stringify(type)} for element ${JSON.stringify(element)}`)
    yield * builder(element)
  },

  * tag (element) {
    const tag = utils.get.name(element)
    const hasAttribs = element[1] && typeof element[1] === 'object' && !Array.isArray(element[1])
    const attribs = hasAttribs ? element[1] : undefined
    assert(typeof tag === 'string', 'tag name must be a string')
    assert(tag.match(/^[a-zA-Z0-9]+$/), 'tag name must be alphanumeric')

    const isSelfClosing = selfClosingTags.has(tag.toLowerCase())
    if (isSelfClosing) {
      if (element.length > (hasAttribs ? 2 : 1)) throw new Error(`<${tag}> html element cannot contain child nodes`)
      yield `<${tag}${[...build.attributes(attribs)].join('')}>`
    } else {
      yield `<${tag}${[...build.attributes(attribs)].join('')}>`
      for (const child of element.slice(hasAttribs ? 2 : 1)) {
        yield * build.any(child)
      }
      yield `</${tag}>`
    }
  },

  * text (element) {
    yield esc(element, '&<')
  },

  * attributes (element) {
    for (const name in element) {
      const value = element[name]
      assert(!`${name}`.match(/[ "'>/=\0\cA-\cZ\u007F-\u009F]/), 'invalid attribute name')

      if (value === true) {
        yield ` ${name}`
      } else if (value === false) {
        continue
      } else if (typeof value === 'string') {
        if (value.match(/[ "'`=<>]/)) {
          const counts = frequency(value, '\'"')
          if (counts['"'] > counts["'"]) {
            yield ` ${name}='${esc(value, "&'")}'`
          } else {
            yield ` ${name}="${esc(value, '&"')}"`
          }
        } else {
          // no quotes needed
          yield ` ${name}=${esc(value, '"\'&<>')}`
        }
      }
    }
  },

  * comment (element) {
    yield `<!--${utils.get.text(element).replace('--', ' - -')}-->`
  },

  * fragment (element) {
    for (const child of utils.get.childNodes(element)) {
      yield * build.any(child)
    }
  },

  * document (element) {
    const doctype = utils.get.attribute(element, 'doctype')
    if (typeof doctype === 'string') yield `<!DOCTYPE ${doctype}>\n`
    for (const child of utils.get.childNodes(element)) {
      yield * build.any(child)
    }
  },

  * cdata (element) {
    const text = utils.get.text(element)
    assert(!text.includes(']]>'), 'CDATA cannot contain the literal text ]]>')
    yield `<![CDATA[${text}]]>`
  }
}
