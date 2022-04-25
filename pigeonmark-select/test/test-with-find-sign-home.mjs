/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import pmhtml from 'pigeonmark-html'
import select from '../lib/index.js'
import fs from 'fs'

const doc = pmhtml.decode(fs.readFileSync('test-data/find-sign.html'))

describe('test with find-sign homepage html', () => {
  const img = ['img', { id: 'header', alt: 'Home Button', src: '/style/assets/find-sign-logo.svg?b75877a8' }]

  it('find the logo: #header', () => {
    expect(select.selectAll(doc, '#header')).to.deep.equal([img])
  })

  it('find the logo: img#header', () => {
    expect(select.selectAll(doc, 'img#header')).to.deep.equal([img])
  })

  it('find the logo: body > a > img', () => {
    expect(select.selectAll(doc, 'body > a > img')).to.deep.equal([img])
  })

  it('find the logo: a[href="/"] img', () => {
    expect(select.selectAll(doc, 'a[href="/"] img')).to.deep.equal([img])
    expect(select.selectOne(doc, 'a[href="/"] img')).to.deep.equal(img)
  })

  it('finds the discovery feed links: .discovery-link', () => {
    expect(select.selectAll(doc, '.discovery-link')).to.have.length(20)
  })

  const rememberLink = ['a', { href: 'https://www.instagram.com/p/COEdX7-n3s4/', class: 'entry-link p-name u-url' }, 'remember']

  it('finds the "remember" link: a:contains("remember")', () => {
    expect(select.selectAll(doc, 'a:contains("remember")')).to.deep.equal([rememberLink])
  })

  it('finds the undocumented: .discovery-link:not(:contains("documented")) time', () => {
    expect(select.selectAll(doc, '.discovery-link:not(:contains("documented")) time')).to.have.length(15)
  })

  it('is() seems to work', () => {
    expect(select.is(pmhtml.decode('<div class=foo></div>'), '.foo')).to.be.true
    expect(select.is(pmhtml.decode('<div class=foo></div>'), '.bar')).to.be.false
  })

  it('does not find nonsense queries', () => {
    expect(select.selectAll(doc, '.doesnotexist')).to.deep.equal([])
    expect(select.selectOne(doc, '.doesnotexist')).to.be.undefined
  })
})
