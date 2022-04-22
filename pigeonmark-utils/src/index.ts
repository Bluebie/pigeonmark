export type {
  PMTagWithAttributes, PMTagWithoutAttributes, PMTag, PMText, PMCData, PMComment, PMChildNode,
  PMXMLPI, PMHTMLDocument, PMXMLDocument, PMDocument, PMFragment, PMRootNode, PMNode
} from './types'

import isPigeonMark from './isPigeonMark.js'
import get from './get/index.js'
import set from './set/index.js'
import create from './create/index.js'

export { get, set, create, isPigeonMark }
export default { get, set, create, isPigeonMark }