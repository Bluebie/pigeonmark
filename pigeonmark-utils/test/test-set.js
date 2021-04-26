/* eslint-env mocha */
const { expect } = require('chai')
const pmu = require('../library/index.js')

describe('pigeonmark-utils.set', () => {
  it('pigeonmark-utils.set.name(node)', () => {
    const test1 = ['div', { attr: 'val' }, 'child']
    const goal1 = ['span', { attr: 'val' }, 'child']
    expect(test1).to.not.deep.equal(goal1)
    expect(pmu.set.name(test1, 'span')).to.deep.equal(goal1)
    expect(test1).to.deep.equal(goal1)

    const test2 = ['div', 'child']
    const goal2 = ['span', 'child']
    expect(pmu.set.name(test2, 'span')).to.deep.equal(goal2)
    expect(test2).to.deep.equal(goal2)

    const test3 = ['?xml', { version: '1.0' }]
    const goal3 = ['?xml-stylesheet', { version: '1.0' }]
    expect(pmu.set.name(test3, 'xml-stylesheet')).to.deep.equal(goal3)
    expect(test3).to.deep.equal(goal3)
  })

  it('pigeonmark-utils.set.attribute(node, name)', () => {
    const test1 = ['tag']
    const goal1 = ['tag', { attr: 'val' }]
    expect(pmu.set.attribute(test1, 'attr', 'val')).to.deep.equal(goal1)
    expect(test1).to.deep.equal(goal1)

    const test2 = ['tag', { attr: 'wrong' }]
    const goal2 = ['tag', { attr: 'right' }]
    expect(pmu.set.attribute(test2, 'attr', 'right')).to.deep.equal(goal2)
    expect(test2).to.deep.equal(goal2)

    const test3 = ['?xml', { version: '1.0' }]
    const goal3 = ['?xml', { version: '1.1' }]
    expect(pmu.set.attribute(test3, 'version', '1.1')).to.deep.equal(goal3)
    expect(test3).to.deep.equal(goal3)
  })

  it('pigeonmark-utils.set.attributes(node)', () => {
    const test1 = ['tag']
    const goal1 = ['tag', { attr: 'val' }]
    expect(pmu.set.attributes(test1, { attr: 'val' })).to.deep.equal(goal1)
    expect(test1).to.deep.equal(goal1)

    const test2 = ['tag', { attr: 'val' }]
    const goal2 = ['tag', { newbie: 'foo' }]
    expect(pmu.set.attributes(test2, { newbie: 'foo' })).to.deep.equal(goal2)
    expect(test2).to.deep.equal(goal2)

    const test3 = ['?xml', { version: '1.0' }]
    const goal3 = ['?xml', { version: '1.1' }]
    expect(pmu.set.attributes(test3, { version: '1.1' })).to.deep.equal(goal3)
    expect(test3).to.deep.equal(goal3)
  })

  it('pigeonmark-utils.set.children(node)', () => {
    const test1 = ['tag']
    const goal1 = ['tag', 'text child']
    expect(pmu.set.children(test1, ['text child'])).to.deep.equal(goal1)
    expect(test1).to.deep.equal(goal1)

    const test2 = ['tag', 'with', 'children']
    const goal2 = ['tag', 'text child 2']
    expect(pmu.set.children(test2, ['text child 2'])).to.deep.equal(goal2)
    expect(test2).to.deep.equal(goal2)

    const test3 = ['tag', { has: 'attrs' }, 'with', 'children']
    const goal3 = ['tag', { has: 'attrs' }, 'text child 3']
    expect(pmu.set.children(test3, ['text child 3'])).to.deep.equal(goal3)
    expect(test3).to.deep.equal(goal3)
  })

  it('pigeonmark-utils.set.childNodes(node)', () => {
    const test1 = ['tag']
    const goal1 = ['tag', 'text child']
    expect(pmu.set.childNodes(test1, ['text child'])).to.deep.equal(goal1)
    expect(test1).to.deep.equal(goal1)

    const test2 = ['tag', 'with', 'children']
    const goal2 = ['tag', 'text child 2']
    expect(pmu.set.childNodes(test2, ['text child 2'])).to.deep.equal(goal2)
    expect(test2).to.deep.equal(goal2)

    const test3 = ['tag', { has: 'attrs' }, 'with', 'children']
    const goal3 = ['tag', { has: 'attrs' }, 'text child 3']
    expect(pmu.set.childNodes(test3, ['text child 3'])).to.deep.equal(goal3)
    expect(test3).to.deep.equal(goal3)
  })

  it('pigeonmark-utils.set.id(node)', () => {
    const test1 = ['tag']
    const goal1 = ['tag', { id: 'test1' }]
    expect(pmu.set.id(test1, 'test1')).to.deep.equal(goal1)
    expect(test1).to.deep.equal(goal1)

    const test2 = ['tag', 'with', 'children']
    const goal2 = ['tag', { id: 'test2' }, 'with', 'children']
    expect(pmu.set.id(test2, 'test2')).to.deep.equal(goal2)
    expect(test2).to.deep.equal(goal2)

    const test3 = ['tag', { has: 'attrs' }, 'with', 'children']
    const goal3 = ['tag', { has: 'attrs', id: 'test3' }, 'with', 'children']
    expect(pmu.set.id(test3, 'test3')).to.deep.equal(goal3)
    expect(test3).to.deep.equal(goal3)
  })

  it('pigeonmark-utils.set.classList(node)', () => {
    const test1 = ['tag']
    const goal1 = ['tag', { class: 'test1 cls' }]
    expect(pmu.set.classList(test1, ['test1', 'cls'])).to.deep.equal(goal1)
    expect(test1).to.deep.equal(goal1)

    const test2 = ['tag', 'with', 'children']
    const goal2 = ['tag', { class: 'test2 cls' }, 'with', 'children']
    expect(pmu.set.classList(test2, ['test2', 'cls'])).to.deep.equal(goal2)
    expect(test2).to.deep.equal(goal2)

    const test3 = ['tag', { has: 'attrs' }, 'with', 'children']
    const goal3 = ['tag', { has: 'attrs', class: 'test3' }, 'with', 'children']
    expect(pmu.set.classList(test3, ['test3'])).to.deep.equal(goal3)
    expect(test3).to.deep.equal(goal3)
  })

  it('pigeonmark-utils.set.text(node)', () => {
    const docTest1 = ['#document']
    const docGoal1 = ['#document', 'text']
    expect(pmu.set.text(docTest1, 'text')).to.deep.equal(docTest1)
    expect(docTest1).to.deep.equal(docGoal1)

    const docTest2 = ['#document', { doctype: 'html' }]
    const docGoal2 = ['#document', { doctype: 'html' }, 'text']
    expect(pmu.set.text(docTest2, 'text')).to.deep.equal(docTest2)
    expect(docTest2).to.deep.equal(docGoal2)

    const docTest3 = ['#document', { doctype: 'html' }, 'prev-content']
    const docGoal3 = ['#document', { doctype: 'html' }, 'text']
    expect(pmu.set.text(docTest3, 'text')).to.deep.equal(docTest3)
    expect(docTest3).to.deep.equal(docGoal3)

    const tagTest1 = ['tag']
    const tagGoal1 = ['tag', 'text']
    expect(pmu.set.text(tagTest1, 'text')).to.deep.equal(tagTest1)
    expect(tagTest1).to.deep.equal(tagGoal1)

    const tagTest2 = ['tag', { attr: 'val' }]
    const tagGoal2 = ['tag', { attr: 'val' }, 'text']
    expect(pmu.set.text(tagTest2, 'text')).to.deep.equal(tagTest2)
    expect(tagTest2).to.deep.equal(tagGoal2)

    const tagTest3 = ['tag', { attr: 'val' }, 'prev-content']
    const tagGoal3 = ['tag', { attr: 'val' }, 'text']
    expect(pmu.set.text(tagTest3, 'text')).to.deep.equal(tagTest3)
    expect(tagTest3).to.deep.equal(tagGoal3)
  })
})
