/* eslint-env mocha */
const { expect } = require('chai')
const encode = require('../library/encode')
const xmlns = require('../library/xmlns')

describe('arbitrary.encode()', () => {
  it('encodes numbers', () => {
    expect(encode(123)).to.deep.ordered.equal(['number', { xmlns }, '123'])
    expect(encode(100.5)).to.deep.ordered.equal(['number', { xmlns }, '100.5'])
    expect(encode(-60.8)).to.deep.ordered.equal(['number', { xmlns }, '-60.8'])
  })

  it('encodes booleans', () => {
    expect(encode(true)).to.deep.ordered.equal(['true', { xmlns }])
    expect(encode(false)).to.deep.ordered.equal(['false', { xmlns }])
  })

  it('encodes null and undefined', () => {
    expect(encode(null)).to.deep.ordered.equal(['null', { xmlns }])
    expect(encode(undefined)).to.deep.ordered.equal(['undefined', { xmlns }])
  })

  it('encodes strings', () => {
    expect(encode('test')).to.deep.ordered.equal(['string', { xmlns }, 'test'])
    expect(encode('🍃')).to.deep.ordered.equal(['string', { xmlns }, '🍃'])
  })

  it('encodes arrays', () => {
    expect(encode([true, false, 123])).to.deep.ordered.equal(['array', { xmlns }, ['true'], ['false'], ['number', '123']])
    expect(encode(['foo', null, undefined])).to.deep.ordered.equal(['array', { xmlns }, ['string', 'foo'], ['null'], ['undefined']])
  })

  it('encodes objects', () => {
    expect(encode({ })).to.deep.equal(['object', { xmlns }])
    expect(encode({ handshape: 5 })).to.deep.ordered.equal(['object', { xmlns }, ['number', { name: 'handshape' }, 5]])
    expect(encode({ a: true, b: false })).to.deep.ordered.equal(['object', { xmlns }, ['true', { name: 'a' }], ['false', { name: 'b' }]])
  })

  it('encodes buffers', () => {
    expect(encode(Buffer.from('Hello'))).to.deep.equal(['buffer', { xmlns, encoding: 'base64' }, Buffer.from('Hello').toString('base64')])
  })

  it('encodes sets', () => {
    expect(encode(new Set([1, 2, 3]))).to.deep.ordered.equal(['set', { xmlns }, ['number', '1'], ['number', '2'], ['number', '3']])
  })

  it('encodes maps', () => {
    expect(encode(new Map([['a', 'b']]))).to.deep.ordered.equal(['map', { xmlns }, ['two', ['string', 'a'], ['string', 'b']]])
  })

  it('encodes bigints', () => {
    expect(encode(123n)).to.deep.ordered.equal(['bigint', { xmlns }, '123'])
  })

  it('encodes symbols', () => {
    expect(encode(Symbol('foo'))).to.deep.ordered.equal(['symbol', { xmlns, id: 0 }, 'foo'])
  })
})
