// legacy entities are ones which do not require a semicolon to be ambiguous
const legacyEntities = [
  'AElig', 'AMP', 'Aacute', 'Acirc', 'Agrave', 'Aring', 'Atilde', 'Auml', 'COPY', 'Ccedil', 'ETH',
  'Eacute', 'Ecirc', 'Egrave', 'Euml', 'GT', 'Iacute', 'Icirc', 'Igrave', 'Iuml', 'LT', 'Ntilde',
  'Oacute', 'Ocirc', 'Ograve', 'Oslash', 'Otilde', 'Ouml', 'QUOT', 'REG', 'THORN', 'Uacute',
  'Ucir', 'Ugrave', 'Uuml', 'Yacute', 'aacute', 'acirc', 'acute', 'aelig', 'agrave', 'amp', 'aring',
  'atilde', 'auml', 'brvbar', 'ccedil', 'cedil', 'cent', 'copy', 'curren', 'deg', 'divide', 'eacute',
  'ecirc', 'egrave', 'eth', 'euml', 'frac12', 'frac14', 'frac34', 'gt', 'iacute', 'icirc', 'iexcl',
  'igrave', 'iquest', 'iuml', 'laquo', 'lt', 'macr', 'micro', 'middot', 'nbsp', 'not', 'ntilde',
  'oacute', 'ocirc', 'ograve', 'ordf', 'ordm', 'oslash', 'otilde', 'ouml', 'para', 'plusmn', 'pound',
  'quot', 'raquo', 'reg', 'sect', 'shy', 'sup1', 'sup2', 'sup3', 'szlig', 'thorn', 'times', 'uacute',
  'ucirc', 'ugrave', 'uml', 'uuml', 'yacute', 'yen', 'yuml'
]

// build a pattern which matches all ambiguous entities, as well as < > " ' chars
const pattern = `([<>"']|&[#a-zA-Z0-9][a-zA-Z0-9]*;|&(${legacyEntities.join('|')}))`
const regexp = new RegExp(pattern, 'g')

// does html encoding escaping to strings in the most minimally invasive way possible, including ambiguous ampersand logic
module.exports = function esc (string, replaceList) {
  const table = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&#34;', "'": '&#39;' }
  return string.replace(regexp, match => {
    const char = match[0]
    return (replaceList.includes(char) ? table[char] : char) + match.slice(1)
  })
}
