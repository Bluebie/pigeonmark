## PigeonMark Select

This package is a simple wrapper around `css-select` which provides easy use with JsonML and PigeonMark documents. Basically, it's querySelectorAll for JsonML.

You can also just import `pigeonmark-select/adapter` and use that as the adapter option to libraries compatible with css-select adapters.

### Version History

- 1.0.0 - Initial release with basic testing, seems to work
- 2.0.0 - Rewrite as typescript, esm module, no cjs/require support from here on out.

### pkg.selectAll(tree, selector)

Returns an array of nodes that match the selectors

### pkg.selectOne(tree, selector)

Returns just one node that matches, or falsey otherwise

### pkg.is(element, selector)

Returns boolean, does the element match the selector?

### pkg.compile(selector)

Compile a selector function using the adapter
