/* eslint-env mocha */
const { expect } = require('chai')
const decode = require('../library/decode')
const xmlns = require('../library/xmlns')

describe('arbitrary.decode()', () => {
  it('decodes numbers', () => {
    expect(decode(['number', { xmlns }, '123'])).to.equal(123)
    expect(decode(['number', { xmlns }, '100.5'])).to.equal(100.5)
    expect(decode(['number', { xmlns }, '-60.8'])).to.equal(-60.8)
  })

  it('decodes booleans', () => {
    expect(decode(['true', { xmlns }])).to.equal(true)
    expect(decode(['false', { xmlns }])).to.equal(false)
  })

  it('decodes null and undefined', () => {
    expect(decode(['null', { xmlns }])).to.equal(null)
    expect(decode(['undefined', { xmlns }])).to.equal(undefined)
  })

  it('decodes strings', () => {
    expect(decode(['string', { xmlns }, 'test'])).to.equal('test')
    expect(decode(['string', { xmlns }, '🍃'])).to.equal('🍃')
  })

  it('decodes arrays', () => {
    expect(decode(['array', { xmlns }, ['true'], ['false'], ['number', '123']])).to.deep.ordered.equal([true, false, 123])
    expect(decode(['array', { xmlns }, ['string', 'foo'], ['null'], ['undefined']])).to.deep.ordered.equal(['foo', null, undefined])
  })

  it('decodes objects', () => {
    expect(decode(['object', { xmlns }])).to.deep.equal({ })
    expect(decode(['object', { xmlns }, ['number', { name: 'handshape' }, '5']])).to.deep.equal({ handshape: 5 })
    expect(decode(['object', { xmlns }, ['true', { name: 'a' }], ['false', { name: 'b' }]])).to.deep.equal({ a: true, b: false })
  })

  it('decodes buffers', () => {
    const dec = decode(['buffer', { xmlns, encoding: 'base64' }, Buffer.from('Hello').toString('base64')])
    expect(dec.equals(Buffer.from('Hello'))).to.equal(true)
  })

  it('decodes sets', () => {
    expect(decode(['set', { xmlns }, ['number', '1'], ['number', '2'], ['number', '3']])).to.deep.equal(new Set([1, 2, 3]))
  })

  it('decodes maps', () => {
    expect(decode(['map', { xmlns }, ['two', ['string', 'a'], ['string', 'b']]])).to.deep.equal(new Map([['a', 'b']]))
  })

  it('decodes bigints', () => {
    expect(decode(['bigint', { xmlns }, '123'])).to.deep.ordered.equal(123n)
  })

  it('decodes symbols', () => {
    expect(decode(['symbol', { xmlns, id: '0' }, 'foo'])).to.be.a('symbol')
    const [a, b] = decode(['array', { xmlns }, ['symbol', { id: '0' }, 'foo'], ['symbol', { id: '0' }, 'foo']])
    expect(a).to.be.a('symbol')
    expect(b).to.be.a('symbol')
    expect(a).to.equal(b)

    const [c, d] = decode(['array', { xmlns }, ['symbol', { id: '0' }, 'foo'], ['symbol', { id: '1' }, 'foo']])
    expect(c).to.be.a('symbol')
    expect(d).to.be.a('symbol')
    expect(c).to.not.equal(d)
    expect(a).to.not.equal(c)
  })

  it('decodes urls', () => {
    const result = decode(['url', { xmlns }, 'https://example.com/a/b/c'])
    expect(result).to.be.a('url')
    expect(result.toString()).to.equal('https://example.com/a/b/c')
  })
})
