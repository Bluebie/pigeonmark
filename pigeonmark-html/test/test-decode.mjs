/* eslint-env mocha */
import decode from "../decode.js"
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

describe('pigeonmark-html.decode()', () => {
  const testPage = [
    '<!DOCTYPE html>\n',
    '<html><head><title>Hello World</title></head>',
    '<body><p id="universe">how you doing??</p><!-- comments are preserved --></body>',
    '</html>'
  ].join('')

  it('can decode a simple html page', () => {
    const dec = decode(testPage)
    expect(dec).to.deep.equal(['#document', { doctype: 'html' },
      ['html',
        ['head', ['title', 'Hello World']],
        ['body', ['p', { id: 'universe' }, 'how you doing??'], ['#comment', ' comments are preserved ']]
      ]
    ])
  })

  it('decodes the core types correctly', () => {
    expect(decode('<!-- hello -->')).to.deep.equal(['#comment', ' hello '])
    expect(decode('<br><br>')).to.deep.equal(['#document-fragment', ['br'], ['br']])
    expect(decode('foo')).to.deep.equal('foo')
    expect(decode('&amp;amp;')).to.deep.equal('&amp;')
    expect(decode('&lt;tag>')).to.deep.equal('<tag>')
    expect(decode('<![CDATA[testing & stuff]]>')).to.deep.equal(['#cdata-section', 'testing & stuff'])
    expect(decode('<tag name=yehaw></tag>')).to.deep.equal(['tag', { name: 'yehaw' }])
  })

  it('handles unicode', () => {
    for (const string of Object.values(unicode)) {
      expect(decode(string)).to.equal(string)
      expect(decode(`<tag>${string}</tag>`)).to.deep.equal(['tag', string])
      expect(decode(`<img title="${string}">`)).to.deep.equal(['img', { title: string }])
      expect(decode(`<!--${string}-->`)).to.deep.equal(['#comment', string])
      expect(decode(`<!DOCTYPE ${string}>`)).to.deep.equal(['#document', { doctype: string }])
    }
  })
})
