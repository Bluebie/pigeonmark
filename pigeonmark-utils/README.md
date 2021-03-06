## PigeonMark Utilities

`pigeonmark-utils` is a set of light weight utilties useful for interacting with JsonML and PigeonMark representations of html and xml documents. It provides some getters and setters to more easily manipulate JsonML documents, and a minimalist but fairly strict test function `isPigeonMark()` which tells you if a structure looks like valid PigeonMark/JsonML.

### Updates:

- 1.0.0 - Initial Release with just `utils.get` functions
- 1.0.1 - Bugfix for `utils.get.name()`
- 1.0.2 - Added `utils.set` functions
- 1.0.3 - Added `utils.isPigeonMark()`
- 1.0.4 - Fixes to `pigeonmark-utils/library/tree-selector-adapter`
- 1.0.5 - Updates to dev dependancies mocha and chai to silence npm audit fails
- 2.0.1 - Rewrite in typescript, switch to esm modules, all set functions return a new node mutated in the requested way instead of modifying the input node, create functions now exist
- 2.0.2 - make all the isType functions available through `utils.get.isWhatever`

## API

```js
import utils from 'pigeonmark-utils'
```

Help adapting this to support ES6 style imports would be very appreciated!

### `utils.get.type(node)`

Given a node, returns one of the strings: `tag`, `text`, `attributes`, `document`, `pi`, `cdata`, `comment`, or `fragment`. If the input node is not valid PigeonMark, it may return undefined. For JsonML inputs, the result will always be either `tag`, `text`, or `attributes`

You can also find more specific `isTag`, `isText`, `isAttributes`, `isComment`, etc functions on this import if you import `pigeonmark-utils/get/type` directly. These can be helpful in typescript as they work as type guards.

### `utils.get.name(node)` or `utils.set.name(node, stringValue)`

Gets the string tag name of a tag node or xml processing instruction node

```js
utils.get.name(['tag', { attr: 'val' }, 'child text']) //=> 'tag'
utils.get.name(['?xml', { version: '1.0' }]) //=> 'xml'
utils.set.name(['?xml', { version: '1.0' }], 'xml-stylesheet') //=> ['?xml-stylesheet', { version: '1.0' }]
```

### `utils.get.id(tag)` or `utils.set.id(tag, stringValue)`

Shortcut to read or write the ID attribute of a tag, returns a string or undefined.

```js
utils.get.id(['tag', { id: 'foo' }, 'child text']) //=> 'foo'
utils.get.id(['tag', 'child text']) //=> undefined
utils.set.id(['tag', 'child text'], 'foo') //=> ['tag', { id: 'foo' }, 'child text']
```

### `utils.get.classList(tag)` or `utils.set.classList(tag, arrayOfStrings)`

Returns array of strings from tag's 'class' attribute, or an empty array if it is empty or unset.

```js
utils.get.classList(['tag', { class: 'foo bar' }]) //=> ['foo', 'bar']
utils.get.classList(['tag']) //=> []
```

### `utils.get.attribute(tag, attrName)` or `utils.set.attribute(tag, attrName, attrStringValue)`

Returns an attribute value from a tag or xml processing instruction as a string, or undefined if it isn't set. The set varient sets an attribute's value to a string.

### `utils.get.attributes(tag)` or `utils.set.attributes(tag, attributesObject)`

Gets a tag's attributes as an object, or replaces a tag's attributes with an object.

### `utils.get.children(node)` or `utils.set.children(node, childList)`

Gets the child tags of a node as an array, excluding direct descendants of other types (for example, skipping text nodes and comments)

The set varient replaces all the childNodes of the node with a child list.

### `utils.get.childNodes(node)` or `utils.set.childNodes(node, childList)`

Gets all the child nodes of a node, including text nodes, comments, cdata, as well as tags, as an ordered array, or in the set varient, replaces those items

### `utils.get.text(node)` or `utils.set.text(node, string)`

Like WebAPI's Element.textContent property, returns all the child text nodes, concatinated together in to one string, including descendents inside of tags within this one. The set varient returns a new identical node with this node's child nodes replaced with a single text element containing the string.

### `utils.create.tag('name', { attr: value }, childNodes[])`

Creates a tag, using the supplied parameters

```js
utils.create.tag('label', { for: 'foo' }, ['hello world']) //=> ['label', { for: 'foo' }, 'hello world']
```

### `utils.isPigeonMark(node)`

given an object, tests if that object could possibly be the root node of a PigeonMark document, which being a slightly extended superset of JsonML, is also good at detecting JsonML documents.

Note that any string is technically a valid JsonML document, as it's a text root node, so lookout for that.

This function tries to do some light validation, so it will return false for most structures that would fail to serialize to XML in really obvious ways, like spaces in tag names, or tag names that aren't strings.