const utils = require('pigeonmark-utils')

const symbolTable = new Map()

const decoder = {
  true () { return true },
  false () { return false },
  null () { return null },
  undefined () { return undefined },

  number (element) {
    return parseFloat(utils.get.text(element))
  },

  bigint (element) {
    return BigInt(utils.get.text(element))
  },

  string (element) {
    return utils.get.text(element)
  },

  date (element) {
    return new Date(utils.get.text(element))
  },

  buffer (element) {
    return Buffer.from(utils.get.text(element), utils.get.attribute(element, 'encoding'))
  },

  array (element) {
    return utils.get.children(element).map(decode)
  },

  object (element) {
    return Object.fromEntries(utils.get.children(element).map(child => {
      const name = utils.get.attribute(child, 'name')
      const value = decode(child)
      return [name, value]
    }))
  },

  set (element) {
    return new Set(utils.get.children(element).map(decode))
  },

  map (element) {
    const twos = utils.get.children(element).filter(x => utils.get.name(x) === 'two')
    return new Map(twos.map(x => {
      const [keyTag, valueTag] = utils.get.children(x)
      return [keyTag, valueTag].map(decode)
    }))
  },

  symbol (element) {
    const id = utils.get.attribute(element, 'id')
    if (!symbolTable.has(id)) {
      symbolTable.set(id, Symbol(utils.get.text(element)))
    }
    return symbolTable.get(id)
  },

  url (element) {
    return new URL(utils.get.text(element))
  }
}

function decode (element) {
  const tag = utils.get.name(element)
  return decoder[tag](element)
}

/**
 * Reads JsonML/PigeonMark structure and decodes to arbitrary data
 * @param {utils.PMTag} rootTag
 * @returns {boolean|null|undefined|string|Array|Set|Map|Symbol|object|Buffer|Date|bigint|number}
 */
module.exports = (rootTag) => {
  try {
    const type = utils.get.type(rootTag)
    if (['document', 'fragment'].includes(type)) {
      return decode(utils.get.children(rootTag)[0])
    } else if (type === 'tag') {
      return decode(rootTag)
    }
  } finally {
    symbolTable.clear()
  }
}
