/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { isPigeonMark } from '../index.js'

describe('isPigeonMark()', () => {
  it('works for tags', () => {
    expect(isPigeonMark(['node'])).to.be.true
    expect(isPigeonMark(['node', 'text node'])).to.be.true
    expect(isPigeonMark(['node', {}])).to.be.true
    expect(isPigeonMark(['node', {}, 'text node'])).to.be.true
    expect(isPigeonMark(['node', { attr: 'val' }])).to.be.true
    expect(isPigeonMark(['node', { attr: 'val' }, 'text node'])).to.be.true
  })

  it('works for text nodes', () => {
    expect(isPigeonMark('text node')).to.be.true
  })

  it('works for other node types', () => {
    expect(isPigeonMark(['#comment', 'hey'])).to.be.true
    expect(isPigeonMark(['#document', 'hey'])).to.be.true
    expect(isPigeonMark(['#document-fragment', 'hey'])).to.be.true
    expect(isPigeonMark(['#cdata-section', 'hey'])).to.be.true
  })

  it('fails for tag lookalikes', () => {
    expect(isPigeonMark([''])).to.be.false
    expect(isPigeonMark([])).to.be.false
    expect(isPigeonMark([123])).to.be.false
    expect(isPigeonMark(['looks-kinda-like-a-tag', { but: 'it has bad children' }, 'text node', 123, 'text node'])).to.be.false
    expect(isPigeonMark(['tags cant have spaces'])).to.be.false
  })

  it('fails for random types', () => {
    expect(isPigeonMark({ key: 'val' })).to.be.false
    expect(isPigeonMark(123)).to.be.false
    expect(isPigeonMark(null)).to.be.false
    expect(isPigeonMark(undefined)).to.be.false
    expect(isPigeonMark(NaN)).to.be.false
    expect(isPigeonMark(Infinity)).to.be.false
    expect(isPigeonMark(-Infinity)).to.be.false
    expect(isPigeonMark(8882991n)).to.be.false
    expect(isPigeonMark([1, 2, 3])).to.be.false
    expect(isPigeonMark(-8000)).to.be.false
    expect(isPigeonMark(Buffer.from('yehaw'))).to.be.false
    expect(isPigeonMark(new Date())).to.be.false
  })
})
