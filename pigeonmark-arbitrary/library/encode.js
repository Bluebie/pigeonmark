
const utils = require('pigeonmark-utils')
const xmlns = require('./xmlns')

const symbolTable = new Map()
let symbolSeq = 0

function encode (obj) {
  if (obj === null) {
    return ['null']
  } else if (obj === undefined) {
    return ['undefined']
  } else if (typeof obj === 'string') {
    return ['string', `${obj}`]
  } else if (typeof obj === 'number') {
    return ['number', obj.toString()]
  } else if (obj === true || obj === false) {
    return [obj ? 'true' : 'false']
  } else if (obj instanceof Date) {
    return ['date', obj.toISOString()]
  } else if (obj instanceof Map) {
    return ['map', ...[...obj.entries()].map(([key, value]) => {
      return ['two', encode(key), encode(value)]
    })]
  } else if (obj instanceof Set) {
    return ['set', ...[...obj].map(v => encode(v))]
  } else if (obj instanceof URL) {
    return ['url', obj.href]
  } else if (Buffer.isBuffer(obj)) {
    return ['buffer', { encoding: 'base64' }, obj.toString('base64')]
  } else if (typeof obj === 'object') {
    if (Symbol.iterator in obj) {
      return ['array', ...[...obj].map(v => encode(v))]
    } else {
      return ['object', ...Object.entries(obj).map(([prop, value]) => {
        const enc = encode(value)
        utils.set.attribute(enc, 'name', prop)
        return enc
      })]
    }
  } else if (typeof obj === 'bigint') {
    return ['bigint', obj.toString()]
  } else if (typeof obj === 'symbol') {
    return symbolTable.get(obj) || symbolTable.set(obj, ['symbol', { id: (symbolSeq++).toString(36) }, obj.description]).get(obj)
  } else {
    throw new Error('Unsupported type: ' + JSON.stringify(obj))
  }
}

/**
 * encode an arbitrary object in to PigeonMark/JsonML in PigeonMark Arbitrary format
 * @param {null|undefined|string|number|Date|Buffer|true|false|Array|object|Map|Set|symbol} obj - any object
 * @returns {utils.PMTag}
 */
module.exports = function encodeRoot (obj) {
  try {
    const enc = encode(obj)
    utils.set.attribute(enc, 'xmlns', xmlns)
    return enc
  } finally {
    symbolTable.clear()
    symbolSeq = 0
  }
}
