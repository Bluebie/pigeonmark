// html/xml element attributes, as a plain js object
export type PMAttributes = {
  [key: string]: string
}

// html/xml element which doesn't have any attributes
export type PMTagWithoutAttributes = [
  tag: string,
  ...children: PMChildNode[]
]

// html/xml element which has attributes
export type PMTagWithAttributes = [
  tag: string,
  attributes: PMAttributes,
  ...children: PMChildNode[]
]

// html/xml element which might have an attributes object
export type PMTag = PMTagWithAttributes | PMTagWithoutAttributes

// text node
export type PMText = string

// cdata node
export type PMCData = [tag: '#cdata-section', ...text: PMText[]]

// comment node
export type PMComment = [tag: '#comment', ...text: PMText[]]

// possible children nodes inside an element, fragment, or document
export type PMChildNode = PMTag | PMCData | PMComment | PMText

// xml processing instruction
export type PMXMLPI = [tag: string, attributes: PMAttributes]

// html document
export type PMHTMLDocument = [tag: '#document', attributes: { doctype?: string }, ...children: PMChildNode[]]

// xml document
export type PMXMLDocument = [tag: '#document', attributes: { doctype?: string, pi?: PMXMLPI[] }, ...children: PMChildNode[]]

// generic document, could be html or xml
export type PMDocument = PMXMLDocument | PMHTMLDocument

// XML document fragment container, used to group several root level tags and texts together
export type PMFragment = [tag: '#document-fragment', ...children: PMChildNode[]]

// possible node types that could form the root of a tree
export type PMRootNode = PMTag | PMText | PMFragment | PMDocument

// possible node types
export type PMNode = PMTag | PMAttributes | PMText | PMCData | PMComment | PMXMLPI | PMHTMLDocument | PMFragment