/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const isArbitrary = require('../library/is-arbitrary-encoded')
const xmlns = require('../library/xmlns')

describe('isArbitrary()', () => {
  it('recognises documents containing pm:arb as root tag', () => {
    expect(isArbitrary(['#document', ['string', { xmlns }, 'foo']])).to.be.true
    expect(isArbitrary(['#document', {}, ['string', { xmlns }, 'foo']])).to.be.true
    expect(isArbitrary(['#document', { doctype: 'foo' }, ['string', { xmlns }, 'foo']])).to.be.true
    expect(isArbitrary(['#document', { xmlpi: [['?xml', { version: '1.0' }]] }, ['string', { xmlns }, 'foo']])).to.be.true
    expect(isArbitrary(['#document', { doctype: 'foo' }, '\n\n\n', ['string', { xmlns }, 'foo'], '\n\n\n'])).to.be.true
    expect(isArbitrary(['#document', { doctype: 'foo' }, ['#comment', 'foo'], ['string', { xmlns }, 'foo'], '\n\n\n'])).to.be.true
  })

  it('recognises fragments containing pm:arb as root tag', () => {
    expect(isArbitrary(['#document-fragment', ['string', { xmlns }, 'foo']])).to.be.true
    expect(isArbitrary(['#document-fragment', '\n\n\n', ['string', { xmlns }, 'foo'], '\n\n\n'])).to.be.true
    expect(isArbitrary(['#document-fragment', ['#comment', 'foo'], ['string', { xmlns }, 'foo'], '\n\n\n'])).to.be.true
  })

  it('recognises being given directly a tag which is arbitrary data root', () => {
    expect(isArbitrary(['string', { xmlns }, 'foo'])).to.be.true
  })

  it('says no with a wrong namespace', () => {
    expect(isArbitrary(['string', { xmlns: 'wrong' }, 'foo'])).to.be.false
    expect(isArbitrary(['#document', ['string', { xmlns: 'nope' }, 'foo']])).to.be.false
    expect(isArbitrary(['#document-fragment', ['string', { xmlns: 'yeah nah' }, 'foo']])).to.be.false
  })

  it('says no with a missing namespace', () => {
    expect(isArbitrary(['string', 'foo'])).to.be.false
    expect(isArbitrary(['#document', ['string', 'foo']])).to.be.false
    expect(isArbitrary(['#document-fragment', ['string', 'foo']])).to.be.false
  })

  it('says no for things which arent JsonML', () => {
    expect(isArbitrary([1, 2, 3])).to.be.false
    expect(isArbitrary(Buffer.from('foo'))).to.be.false
    expect(isArbitrary(true)).to.be.false
    expect(isArbitrary(false)).to.be.false
  })
})
