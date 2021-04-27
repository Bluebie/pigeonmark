# pigeonmark-arbitrary

This package provides a codec to transform JsonML in to arbitrary data structures composed of javascript objects, arrays, sets, maps, numbers, bigints, strings, buffers, booleans, nulls, and undefined. The resulting JsonML structure can be serialized as xml using `pigeonmark-xml` or any other JsonML codec.

This encoding allows arbitrary non-recursive data structures to processed through XML tooling.

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
 - `new Map([['a', 'b']])` becomes `<map><two><string>a</string><string>b</string></two></map>`
 - `123n` becomes `<bigint>123</bigint>`
 - `new Date()` becomes `<date>2021-04-26T03:21:14.350Z</date>`
 - `Symbol('foo')` becomes `<symbol id="0">foo</symbol>`

The root node of a pigeonmark:arbitrary document must always have the `xmlns` attribute set to `"pigeonmark:arbitrary"`. For example:

```json
{
  "name": "Henry",
  "age": 45,
}
```

encodes to the JsonML/PigeonMark structure:

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

## API

```js
const arbitrary = require('pigeonmark-arbitrary')

arbitrary.encode([1,2,3])
//=> ['array', { xmlns: 'pigeonmark:arbitrary' }, ['number', 1], ['number', 2], ['number', 3]]

arbitrary.decode(['string', { xmlns: 'pigeonmark:arbitrary' }, 'Hello World'])
//=> 'Hello World'
```

### arbitrary.isArbitrary(node)

Test if a given JsonML structure is in pigeonmark-arbitrary format

Returns boolean

### arbitrary.encode(any)

Encode any supported data format in to JsonML structure.

Returns a JsonML node, which is an array whose first element is a string tag name

### arbitrary.decode(node)

Decode a JsonML representation of an arbitrary encoded document. Returns any supported type

<p align=center><img alt="GitHub Actions Continuous Integration Status" src=https://github.com/Bluebie/pigeonmark/actions/workflows/node.js.yml/badge.svg></p>