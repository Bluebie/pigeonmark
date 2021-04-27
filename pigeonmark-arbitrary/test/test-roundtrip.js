/* eslint-env mocha */
const arbitrary = require('../library')
const crypto = require('crypto')
const { expect } = require('chai')

const typeTests = {
  number: [1, 0, -6000, NaN, 9090, -64768, 1000000, 50.88126],
  bigint: [1n, 0n, 2n ** 54n, (2n ** 54n) * -1n],
  object: [{ foo: 'bar' }, { }, { handshape: 5 }, { a: 1, b: 2, c: 3, d: 4 }],
  set: [[1, 2, 3], 'abcdefg'.split('')].map(x => new Set(x)),
  map: [[[1, 'a'], [2, 'b']], [['a', '1'], ['b', '2']]].map(x => new Map(x)),
  singleton: [true, false, null, undefined],
  date: [new Date(), new Date(0)],
  buffer: [Buffer.from('hello world'), Buffer.from('whatever is the matter'), Buffer.alloc(300), crypto.randomBytes(1024)]
}

describe('roundtrip', () => {
  for (const [kind, tests] of Object.entries(typeTests)) {
    it(`roundtrips ${kind} types`, () => {
      for (const value of tests) {
        expect(arbitrary.decode(arbitrary.encode(arbitrary.decode(arbitrary.encode(value))))).to.deep.equal(value)
      }
    })
  }
})
