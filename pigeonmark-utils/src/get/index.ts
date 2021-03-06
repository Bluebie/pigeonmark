import {
  type, isAttributes, isCData, isChildNode, isComment, isDocument, isFragment,
  isProcessingInstruction, isTag, isTagWithAttributes, isTagWithoutAttributes,
  isText
} from './type.js'
import { name } from './name.js'
import { attribute } from './attribute.js'
import { attributes } from './attributes.js'
import { children } from './children.js'
import { childNodes } from './child-nodes.js'
import { id } from './id.js'
import { classList } from './class-list.js'
import { text } from './text.js'

export {
  type, name, attribute, attributes, children, childNodes, id, classList, text,
  isAttributes, isCData, isChildNode, isComment, isDocument, isFragment, isProcessingInstruction,
  isTag, isTagWithAttributes, isTagWithoutAttributes, isText
}
export default {
  type, name, attribute, attributes, children, childNodes, id, classList, text,
  isAttributes, isCData, isChildNode, isComment, isDocument, isFragment, isProcessingInstruction,
  isTag, isTagWithAttributes, isTagWithoutAttributes, isText
}
