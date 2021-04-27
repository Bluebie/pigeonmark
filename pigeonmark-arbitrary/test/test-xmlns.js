/* eslint-env mocha */
const { expect } = require('chai')

describe('xmlns', () => {
  it('pigeonmark-utils.xmlns is correct', () => {
    expect(require('../library/index').xmlns).to.equal('pigeonmark:arbitrary')
  })

  it('pigeonmark-utils/library/xmlns is correct', () => {
    expect(require('../library/xmlns')).to.equal('pigeonmark:arbitrary')
  })
})
