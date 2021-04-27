/* eslint-env mocha */
const pmx = require('../library/index')
const { expect } = require('chai')

const unicode = {
  Arabic: 'ٱلرَّحْمـَ',
  Tamil: 'ராமானுஜன்',
  Chinese: '不亦說乎',
  Sanskrit: 'पशुपतिरपि',
  Greek: 'πάντ',
  Russian: 'оживлённым',
  Chess: '♖♘♗♕♔♗♘♖',
  Emoji: '🤟',
  'Emoji with skintones': '🤙🏽'
}

const ideal = {
  // tag attributes handling
  '<tag1/>':
    ['tag1'],
  '<tag2 attr="val"/>':
    ['tag2', { attr: 'val' }],
  '<tag3 attr="val">text-child</tag3>':
    ['tag3', { attr: 'val' }, 'text-child'],
  '<tag with=\'many "quotes" and "it" "should" "cause" "single" "quote" attr encoding\'/>':
    ['tag', { with: 'many "quotes" and "it" "should" "cause" "single" "quote" attr encoding' }],
  // tag children handling
  '<tag4>text-child</tag4>':
    ['tag4', 'text-child'],
  '<container><subtag/></container>':
    ['container', ['subtag']],
  '<container> <subtag/> </container>':
    ['container', ' ', ['subtag'], ' '],
  '<container>\n  <sub/>\n</container>':
    ['container', '\n  ', ['sub'], '\n'],
  // comments
  '<!-- normal comment -->':
    ['#comment', ' normal comment '],
  // cdata
  '<![CDATA[foo]]>':
    ['#cdata-section', 'foo'],
  // fragments
  '<br/><br/>':
    ['#document-fragment', ['br'], ['br']],
  // xmlpi
  '<?xml version="1.0"?>\n':
    ['#document', { xmlpi: [['?xml', { version: '1.0' }]] }, '\n'],
  // doctype
  '<!DOCTYPE html>\n':
    ['#document', { doctype: 'html', xmlpi: [] }, '\n']

}

// extra structures which are technically acceptable for encoder but not how the xml should ideally decode to PigeonMark
const encodes = {
  // useless empty attr objects
  '<tag/>':
    ['tag', {}],
  // fragmented text nodes
  '<tag>text</tag>':
    ['tag', {}, 't', 'e', 'x', 't'],
  // fragmented comments
  '<!-- comment text -->':
    ['#comment', ' ', 'comment', ' ', 'text', ' '],
  // whitespace
  '\n\n\n\n': '\n\n\n\n',
  '\r\n\r\n': '\r\n\r\n'
}

describe('pigeonmark-xml', function () {
  for (const [label, string] of Object.entries(unicode)) {
    it(`Unicode ${label}`, function () {
      expect(pmx.decode(`<root>${string}</root>`)).to.deep.equal(['root', string])
      expect(pmx.decode(`<node attr="${string}"/>`)).to.deep.equal(['node', { attr: string }])

      expect(pmx.encode(['root', string])).to.equal(`<root>${string}</root>`)
      expect(pmx.encode(['node', { attr: string }])).to.equal(`<node attr="${string}"/>`)
    })
  }

  for (const [string, structure] of Object.entries(ideal)) {
    it(`encode(${JSON.stringify(structure)}) => ${JSON.stringify(string)}`, function () {
      expect(pmx.encode(structure)).to.equal(string)
    })

    it(`decode(${JSON.stringify(string)}) => ${JSON.stringify(structure)}`, function () {
      expect(pmx.decode(string)).to.deep.equal(structure)
    })
  }

  for (const [string, structure] of Object.entries(encodes)) {
    it(`encode(${JSON.stringify(structure)}) => ${JSON.stringify(string)}`, function () {
      expect(pmx.encode(structure)).to.equal(string)
    })
  }
})
