import type { PMNode } from "pigeonmark-utils"
import hp2 from "htmlparser2"

/**
 * decode HTML in to extended JsonML-like format (adding #processing-instruction, #cdata-section, #comment nodes)
 */
export default function decode (string: string): any {
  let doctype
  const root = ['#root']
  let stack: any = [root]
  const top = () => stack[0]
  const push = (data: PMNode) => {
    top().push(data)
    stack.unshift(data)
  }
  const pop = (name: string) => {
    const found = stack.find((v: any) => v[0] === name)
    stack = stack.filter((v: any) => v !== found)
  }

  const parser = new hp2.Parser({
    onprocessinginstruction (name, data) {
      if (name.toLowerCase() === '!doctype') {
        doctype = data.slice('!doctype '.length)
      }
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
  }, { xmlMode: false, decodeEntities: true })

  parser.end(string)

  let result
  // find <html> in root?
  const html = root.find(v => Array.isArray(v) && v[0].toLowerCase() === 'html')
  if (doctype !== undefined || html) {
    result = ['#document', { doctype }, ...(html ? [html] : root.slice(1))]
  } else if (root.length === 2) {
    result = root[1]
  } else {
    result = ['#document-fragment', ...root.slice(1)]
  }

  return result
}
