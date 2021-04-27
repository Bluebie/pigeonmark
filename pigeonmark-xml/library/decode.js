const hp2 = require('htmlparser2')
const utils = require('pigeonmark-utils')

/**
 * decode XML in to extended JsonML-like format (adding #processing-instruction, #cdata-section, #comment nodes)
 * @param {string} string
 * @returns {object|Array}
 */
module.exports = function decode (string) {
  const root = ['#document', { xmlpi: [] }]
  let stack = [root]
  const top = () => stack[0]
  const push = (data) => {
    top().push(data)
    stack.unshift(data)
  }
  const pop = (name) => {
    const found = stack.find(v => v[0] === name)
    stack = stack.filter(v => v !== found)
  }

  const parser = new hp2.Parser({
    onprocessinginstruction (name, data) {
      if (name.startsWith('?')) {
        const mutant = `<tag${data.slice(name.length, -1)}/>`
        const attrs = utils.get.attributes(decode(mutant))
        root[1].xmlpi.push([name, attrs])
      } else if (name === '!DOCTYPE') {
        root[1].doctype = data.slice(name.length + 1)
      }
      stack.push(['#processing-instruction', name, data])
    },

    ontext (string) {
      const parent = top()
      if (parent.length > 1 && typeof parent[parent.length - 1] === 'string') {
        parent[parent.length - 1] = parent[parent.length - 1] + string
      } else {
        parent.push(string)
      }
    },

    onopentag (name, attributes) {
      if (Object.keys(attributes).length > 0) {
        push([name, attributes])
      } else {
        push([name])
      }
    },
    onclosetag (name) { pop(name) },

    oncomment (string) {
      if (string.startsWith('[CDATA[') && string.endsWith(']]')) {
        push(['#cdata-section', string.slice('[CDATA['.length, -']]'.length)])
      } else {
        push(['#comment', string])
      }
    },
    oncommentend () { pop('#comment') },

    oncdatastart () { push(['#cdata-section']) },
    oncdataend () { pop('#cdata-section') },

    onerror (err) { throw err }
  }, { xmlMode: true, decodeEntities: true })

  parser.end(string)

  if (root[1].doctype === undefined && Object.keys(root[1].xmlpi).length === 0) {
    if (root.length === 3) {
      return root[2]
    } else {
      if (utils.get.children(root).length > 1) {
        return ['#document-fragment', ...root.slice(2)]
      } else {
        return ['#document', ...root.slice(2)]
      }
    }
  } else {
    return root
  }
}
