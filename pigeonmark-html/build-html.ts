import assert from "nanoassert"
import selfClosingTagsArr from "html-tags/void.js"
import esc from "./escape.js"
import utils, { PMNode, PMTag, PMText } from "pigeonmark-utils"
import { PMAttributes, PMCData, PMComment, PMDocument, PMFragment } from "pigeonmark-utils/types"
const selfClosingTags = new Set(selfClosingTagsArr)

function frequency (string: string, chars: string) {
  const frequencies = Object.fromEntries([...chars].map(x => [x, 0]))
  for (const char of `${string}`) {
    if (typeof frequencies[char] === 'number') frequencies[char] += 1
  }
  return frequencies
}

export function * any (element: PMNode): Generator<string> {
  const type = utils.get.type(element)
  if (type === 'tag') {
    yield * tag(element as PMTag)
  } else if (type === 'text') {
    yield * text(element as PMText)
  } else if (type === 'attributes') {
    yield * attributes(element as PMAttributes)
  } else if (type === 'comment') {
    yield * comment(element as PMComment)
  } else if (type === 'fragment') {
    yield * fragment(element as PMFragment)
  } else if (type === 'document') {
    yield * document(element as PMDocument)
  } else if (type === 'cdata') {
    yield * cdata(element as PMCData)
  } else {
    throw new Error(`Cannot encode type ${JSON.stringify(type)} for element ${JSON.stringify(element)}`)
  }
}

export function * tag (element: PMTag) {
  const tag = utils.get.name(element)
  const hasAttribs = element[1] && typeof element[1] === 'object' && !Array.isArray(element[1])
  const attribs = hasAttribs ? element[1] as PMAttributes : {}
  assert(typeof tag === 'string', 'tag name must be a string')
  assert(tag.match(/^[a-zA-Z0-9]+$/), 'tag name must be alphanumeric')

  const isSelfClosing = selfClosingTags.has(tag.toLowerCase())
  if (isSelfClosing) {
    if (element.length > (hasAttribs ? 2 : 1)) throw new Error(`<${tag}> html element cannot contain child nodes`)
    yield `<${tag}${[...attributes(attribs)].join('')}>`
  } else {
    yield `<${tag}${[...attributes(attribs)].join('')}>`
    for (const child of element.slice(hasAttribs ? 2 : 1)) {
      yield * any(child)
    }
    yield `</${tag}>`
  }
}

export function * text (element: PMText) {
  yield esc(element, '&<')
}

export function * attributes (element: PMAttributes) {
  for (const name in element) {
    const value = element[name]
    assert(!`${name}`.match(/[ "'>/=\0\cA-\cZ\u007F-\u009F]/), 'invalid attribute name')

    // @ts-ignore-error
    if (value === true || value === '') {
      yield ` ${name}`
    // @ts-ignore-error
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
}

export function * comment (element: PMComment) {
  yield `<!--${utils.get.text(element).replace('--', ' - -')}-->`
}

export function * fragment (element: PMFragment) {
  for (const child of utils.get.childNodes(element)) {
    yield * any(child)
  }
}

export function * document (element: PMDocument) {
  const doctype = element[1].doctype
  if (typeof doctype === 'string') yield `<!DOCTYPE ${doctype}>\n`
  for (const child of utils.get.childNodes(element)) {
    yield * any(child)
  }
}

export function * cdata (element: PMCData) {
  const text = utils.get.text(element)
  assert(!text.includes(']]>'), 'CDATA cannot contain the literal text ]]>')
  yield `<![CDATA[${text}]]>`
}
