/* eslint-env mocha */
import { expect } from 'chai'
import pmu from '../index.js'

describe('pigeonmark-utils.get', () => {
  it('pigeonmark-utils.get.type(node)', () => {
    expect(pmu.get.type(false)).to.equal(undefined)
    expect(pmu.get.type(123)).to.equal(undefined)
    expect(pmu.get.type([])).to.equal(undefined)
    expect(pmu.get.type({})).to.equal('attributes')
    expect(pmu.get.type({ name: 'username' })).to.equal('attributes')
    expect(pmu.get.type({ name: 'username', type: 'text' })).to.equal('attributes')
    expect(pmu.get.type({ name: 'username', type: 'text', 'invalid due to space': 'yeah' })).to.equal(undefined)
    expect(pmu.get.type('string')).to.equal('text')
    expect(pmu.get.type(['#cdata-section', 'content'])).to.equal('cdata')
    expect(pmu.get.type(['#comment', 'string'])).to.equal('comment')
    expect(pmu.get.type(['tag', 'string'])).to.equal('tag')
    expect(pmu.get.type(['tag', {}, 'string'])).to.equal('tag')
    expect(pmu.get.type(['tag', { attr: 'val' }, 'string'])).to.equal('tag')
    expect(pmu.get.type(['tag cant have spaces', { attr: 'val' }, 'string'])).to.equal(undefined)
    expect(pmu.get.type(['tag cant have spaces', { attr: 'val' }])).to.equal(undefined)
    expect(pmu.get.type(['tag cant have spaces'])).to.equal(undefined)
    expect(pmu.get.type(['tag cant have spaces', 'string'])).to.equal(undefined)
    expect(pmu.get.type(['?xml', { version: '1.0' }])).to.equal('pi')
    expect(pmu.get.type(['?xml-stylesheet', { href: 'foo.css' }])).to.equal('pi')
    expect(pmu.get.type(['?xml-random-nonsense', { }])).to.equal('pi')
    expect(pmu.get.type(['?xml-random-nonsense'])).to.equal('pi')
  })

  it('pigeonmark-utils.get.name(node)', () => {
    expect(pmu.get.name(['tag', { id: 'val' }])).to.equal('tag')
    expect(pmu.get.name(['tag', { id: 'val' }, 'string'])).to.equal('tag')
    expect(pmu.get.name(['tag', { id: 'val' }, 'string', ['subtag']])).to.equal('tag')
    expect(pmu.get.name(['tag', { diff: 'val' }, 'string', ['subtag']])).to.equal('tag')
    expect(pmu.get.name(['tag', 'string'])).to.equal('tag')
    expect(pmu.get.name(['tag', 'string', ['subtag']])).to.equal('tag')
    expect(() => pmu.get.name(['#cdata-section', 'foo'])).to.throw
    expect(() => pmu.get.name(['#document', ['tag']])).to.throw
  })

  it('pigeonmark-utils.get.attribute(node, name)', () => {
    expect(pmu.get.attribute(['tag'], 'attr')).to.equal(undefined)
    expect(pmu.get.attribute(['tag', { attr: 'val' }], 'attr')).to.equal('val')
  })

  it('pigeonmark-utils.get.attributes(node)', () => {
    expect(pmu.get.attributes(['tag'])).to.deep.equal({})
    expect(pmu.get.attributes(['tag', { attr: 'val' }])).to.deep.equal({ attr: 'val' })
    expect(pmu.get.attributes([1, 2, 3])).to.deep.equal({ })
    expect(pmu.get.attributes(false)).to.deep.equal({ })
    expect(pmu.get.attributes(null)).to.deep.equal({ })
    expect(pmu.get.attributes('string')).to.deep.equal({ })
  })

  it('pigeonmark-utils.get.children(node)', () => {
    expect(pmu.get.children(['tag'])).to.deep.equal([])
    expect(pmu.get.children(['tag', {}])).to.deep.equal([])
    expect(pmu.get.children(['tag', 'string'])).to.deep.equal([])
    expect(pmu.get.children(['tag', {}, 'string'])).to.deep.equal([])
    expect(pmu.get.children(['tag', ['subtag', { attr: 'val' }], ' ooo ', ['yeah', 'no']])).to.deep.equal([['subtag', { attr: 'val' }], ['yeah', 'no']])
    expect(pmu.get.children(['tag', {}, ['subtag', { attr: 'val' }], ' ooo ', ['yeah', 'no']])).to.deep.equal([['subtag', { attr: 'val' }], ['yeah', 'no']])
    expect(pmu.get.children(['#cdata-section', 'foo'])).to.deep.equal([])
    expect(pmu.get.children(['#document', {}, ['tag']])).to.deep.equal([['tag']])
    expect(pmu.get.children(['#document-fragment', ['tag'], 'string', ['#cdata-section', 'foo'], ['tag2']])).to.deep.equal([['tag'], ['tag2']])
  })

  it('pigeonmark-utils.get.childNodes(node)', () => {
    expect(pmu.get.childNodes(['tag', { attr: 'val' }, 'string'])).to.deep.equal(['string'])
    expect(pmu.get.childNodes(['tag', { attr: 'val' }, 'string', ['tag']])).to.deep.equal(['string', ['tag']])
    expect(pmu.get.childNodes(['tag', 'string'])).to.deep.equal(['string'])
    expect(pmu.get.childNodes(['tag', 'string', ['tag']])).to.deep.equal(['string', ['tag']])
    expect(pmu.get.childNodes(['#cdata-section', 'foo'])).to.deep.equal([])
    expect(pmu.get.childNodes(['#document', {}, ['tag']])).to.deep.equal([['tag']])
    expect(pmu.get.childNodes(['#document-fragment', ['tag'], 'string', ['#cdata-section', 'foo'], ['tag2']])).to.deep.equal([['tag'], 'string', ['#cdata-section', 'foo'], ['tag2']])
  })

  it('pigeonmark-utils.get.id(node)', () => {
    expect(pmu.get.id(['tag', { id: 'val' }])).to.equal('val')
    expect(pmu.get.id(['tag', { id: 'val' }, 'string'])).to.equal('val')
    expect(pmu.get.id(['tag', { id: 'val' }, 'string', ['tag']])).to.equal('val')
    expect(pmu.get.id(['tag', { diff: 'val' }, 'string', ['tag']])).to.equal(undefined)
    expect(pmu.get.id(['tag', 'string'])).to.equal(undefined)
    expect(pmu.get.id(['tag', 'string', ['tag']])).to.equal(undefined)
    expect(pmu.get.id(['#cdata-section', 'foo'])).to.equal(undefined)
    expect(pmu.get.id(['#document', {}, ['tag']])).to.deep.equal(undefined)
  })

  it('pigeonmark-utils.get.classList(node)', () => {
    expect(pmu.get.classList(['tag', { class: 'val' }])).to.deep.equal(['val'])
    expect(pmu.get.classList(['tag', { class: 'val' }, 'string'])).to.deep.equal(['val'])
    expect(pmu.get.classList(['tag', { class: 'val' }, 'string', ['tag']])).to.deep.equal(['val'])
    expect(pmu.get.classList(['tag', { diff: 'val' }, 'string', ['tag']])).to.deep.equal([])
    expect(pmu.get.classList(['tag', 'string'])).to.deep.equal([])
    expect(pmu.get.classList(['tag', 'string', ['tag']])).to.deep.equal([])
    expect(pmu.get.classList(['#cdata-section', 'foo'])).to.deep.equal([])
    expect(pmu.get.classList(['#document', {}, ['tag']])).to.deep.equal([])
  })

  it('pigeonmark-utils.get.text(node)', () => {
    expect(pmu.get.text('string')).to.equal('string')
    expect(pmu.get.text(['#cdata-section', 'string', '2'])).to.equal('string2')
    expect(pmu.get.text(['#comment', 'string', '2'])).to.equal('string2')
    expect(pmu.get.text(['tag', 'string', '2'])).to.equal('string2')
    expect(pmu.get.text(['tag', 'string', ['tag2'], '2'])).to.equal('string2')
    expect(pmu.get.text(['tag', 'string', ['tag2', '3'], '2'])).to.equal('string32')
    expect(pmu.get.text(['tag', 'string', ['tag2', { id: 'yea' }, '3'], '2'])).to.equal('string32')
    expect(pmu.get.text(['tag', 'string', ['#comment', 'string'], '2'])).to.equal('string2')
    expect(pmu.get.text(['tag', 'string', ['#cdata-section', '3'], '2'])).to.equal('string32')
    expect(pmu.get.text(['#document-fragment', ['tag', 'string', ['#cdata-section', '3'], '2']])).to.equal('string32')
    expect(pmu.get.text(['#document', {}, ['tag', 'string', ['#cdata-section', '3'], '2']])).to.equal('string32')
  })
})
