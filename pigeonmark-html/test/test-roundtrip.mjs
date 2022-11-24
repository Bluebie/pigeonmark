/* eslint-env mocha */
import { encode, decode } from "../index.js"
import { expect } from "chai"

describe('pigeonmark-html roundtrip decode() through encode()', () => {
  const testPage = [
    '<!DOCTYPE html>\n',
    '<html><head><title>Hello World</title></head>',
    '<body><p id=universe>how you doing??</p><!-- comments are preserved --></body>',
    '</html>'
  ].join('')

  it('document', () => {
    const dec = decode(testPage)
    const enc = encode(dec)
    const roundtrip = decode(enc)
    expect(dec).to.deep.equal(roundtrip)
  })

  it('fragments', () => {
    const tests = [
      '<img title=foo>',
      '<div id=bar>hello <b>friend</b> welcome to the store</div>',
      '<img title="it’s really nice to meet you">',
      '<!--comment test-->',
      '<br><br><br>',
      '<p>hello</p>\n<p>how are you</p>'
    ]
    for (const string of tests) {
      expect(encode(decode(string))).to.equal(string)
    }
  })
})
