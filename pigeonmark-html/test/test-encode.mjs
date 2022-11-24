/* eslint-env mocha */
import encode from "../encode.js"
import { expect } from "chai"

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

describe('pigeonmark-html.encode()', () => {
  const testPage = [
    '<!DOCTYPE html>\n',
    '<html><head><title>Hello World</title></head>',
    '<body><p id=universe>how you doing??</p><!-- comments are preserved --></body>',
    '</html>'
  ].join('')

  it('can encode a simple html page', () => {
    const enc = encode(['#document', { doctype: 'html' },
      ['html',
        ['head', ['title', 'Hello World']],
        ['body', ['p', { id: 'universe' }, 'how you doing??'], ['#comment', ' comments are preserved ']]
      ]
    ])
    expect(enc).to.equal(testPage)
  })

  it('encodes reasonable structures accurately', () => {
    expect(encode(['#comment', ' hello '])).to.equal('<!-- hello -->')
    expect(encode(['#document-fragment', ['br'], ['br']])).to.equal('<br><br>')
    expect(encode('foo')).to.equal('foo')
    expect(encode('&amp;')).to.equal('&amp;amp;')
    expect(encode('<tag>')).to.equal('&lt;tag>')
    expect(encode({ id: 'bar' })).to.equal(' id=bar')
    expect(encode(['#cdata-section', 'testing & stuff'])).to.equal('<![CDATA[testing & stuff]]>')
  })

  it('handles unicode', () => {
    for (const string of Object.values(unicode)) {
      expect(encode(string)).to.equal(string)
      expect(encode(['tag', string])).to.equal(`<tag>${string}</tag>`)
      expect(encode(['img', { title: ' ' + string }])).to.equal(`<img title=" ${string}">`)
      expect(encode(['img', { title: string }])).to.equal(`<img title=${string}>`)
      expect(encode(['#comment', string])).to.equal(`<!--${string}-->`)
      expect(encode(['#document', { doctype: string }])).to.equal(`<!DOCTYPE ${string}>\n`)
    }
  })

  it('uses efficient attribute encoding', () => {
    expect(encode(['img', { title: 'hello' }])).to.equal('<img title=hello>')
    expect(encode(['img', { title: '' }])).to.equal('<img title>')
    expect(encode(['img', { title: "foo'''bar" }])).to.equal('<img title="foo\'\'\'bar">')
    expect(encode(['img', { title: 'foo"""bar' }])).to.equal('<img title=\'foo"""bar\'>')
    expect(encode(['img', { title: 'foo""\'\'bar' }])).to.equal('<img title="foo&#34;&#34;\'\'bar">')
  })
})
