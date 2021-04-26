## PigeonMark HTML

PigeonMark HTML is an opinionated HTML5 codec, for transforming HTML5 markup in to PigeonMark, and transforming PigeonMark in to compact efficient HTML5 markup.

This codec aims to accurately implement the WHATWG HTML5 living spec, to only produce parseable HTML5 markup. It does not aim to validate that your HTML is correct. For example, it will throw if you try to build an `<img>` tag with child nodes, but it wont if you use attribute or tag names that don't exist in the html5 spec.

PigeonMark HTML aims to be fast and efficient, and to be useful for things like web scraping, database storage (i.e. PigeonOptics), and as a final output stage for server side html rendering.

Decoded HTML is always compatible with JSON encoding for easy storage, and as a superset of JsonML, it is compatible with most JsonML tooling as well, which generally perceives nodes like comments as tags with names like `<#comment></#comment>`

### Installation

```
npm i --save pigeonmark-html
```

### Usage

```js
const html = require('pigeonmark-html')
const structure = html.decode('<!DOCTYPE html>\n<html><head><title>Hello World</title></head></html>')
const string = html.encode(structure)
```