# PigeonMark

This repo contains codecs and specs for PigeonMark, a superset of JsonML encoding, capable of fully representing anything html5 or xml 1.0 encoding can represent, as structured compact data.

Additionally, PigeonMark specifies pigeonmark:arbitrary, an opinionated minimalist standard for encoding JSON-like data structures in to XML. It's also a superset of XML, with support for undefined, and binary values.

Implementations are available here for NodeJS-like platforms.

## Format

PigeonMark implements JsonML encoding at it's core:

 - `<tag>text</tag>` becomes `['tag', 'text']`
 - `<tag attr="val"></tag>` becomes `['tag', { attr: 'val' }]`
 - `<tag id="foo">text</tag>` becomes `['tag', { id: 'foo' }, 'text']`
 - `plain text` becomes `'plain text'`

PigeonMark adds extra encoding to represent other aspects of XML and HTML documents:

 - `<!--text-->` becomes `['#comment', 'text']`
 - `<!DOCTYPE html>` becomes `['!DOCTYPE', 'html']`
 - `<?xml version="1.0">` becomes `['?xml', { version: '1.0' }]`
 - `<![CDATA[text]]>` becomes `['#cdata-section', 'text']`
 - `<br><br>` becomes `['#document-fragment', ['br'], ['br']]`

Where possible these map to WebAPI DOM nodeName properties, to create something like a very lightweight virtual DOM for storage.

## pigeonmark:arbitrary encoding

PigeonMark also specifies an XML encoding for arbitrary data, allowing any JSON-like structure to be transformed to XML

 - `123` becomes `<number>123</number>`
 - `true` becomes `<true/>`
 - `false` becomes `<false/>`
 - `null` becomes `<null/>`
 - `undefined` becomes `<undefined/>`
 - `"text"` becomes `<string>text</string>`
 - `[true, false, 123]` becomes `<array><true/><false/><number>123</number></array>`
 - `{ handshape: 5 }` becomes `<object><number name="handshape">5</number></object>`
 - `Buffer.from('Hello')` becomes `<buffer encoding="utf-8">Hello</buffer>` (or possibly base64 or hex encoding)
 - `new Set([1,2])` becomes `<set><number>1</number><number>2</number></set>`
 - `new Map([['a', 'b']])` becomes `<map><string name="a">b</string></map>`
 - `123n` becomes `<bigint>123</bigint>`
 - `Symbol('foo')` becomes `<symbol id="0">foo</symbol>`

The root node of a pigeonmark:arbitrary document must always have the `xmlns` attribute set to `"pigeonmark:arbitrary"`. For example:

```json
{
  "name": "Henry",
  "age": 45,
}
```

encodes to the PigeonMark structure:

```json
["object", { "xmlns": "pigeonmark:arbitrary" },
  ["string", { "name": "name" }, "Henry"],
  ["number", { "name": "age" }, "45"]
]
```

which serializes to XML:

```xml
<object xmlns="pigeonmark:arbitrary"><string name="name">Henry</string><number name="age">45</number></object>
```