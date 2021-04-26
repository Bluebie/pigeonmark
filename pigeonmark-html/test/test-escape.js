/* eslint-env mocha */
const esc = require('../library/escape')
const { expect } = require('chai')

const unicode = {
  Arabic: 'ٱلرَّحْمـَ',
  Tamil: 'ராமானுஜன்',
  Chinese: '不亦說乎',
  Sanskrit: 'पशुपतिरपि',
  Greek: 'πάντ',
  Russian: 'оживлённым',
  Chess: '♖♘♗♕♔♗♘♖',
  Emoji: '🤟',
  'Emoji with skintones': '🤙🏽'
}

describe('pigeonmark-html/escape()', () => {
  it('basically works', () => {
    expect(esc('"quot<lt>gt\'apos', '&"<>\'')).to.equal('&#34;quot&lt;lt&gt;gt&#39;apos')
    expect(esc('"quot<lt>gt\'apos', '&"')).to.equal('&#34;quot<lt>gt\'apos')
    expect(esc('unambiguous & doesn’t need escaping', '&"')).to.equal('unambiguous & doesn’t need escaping')
    expect(esc('ambiguous &amp; does need escaping', '&"')).to.equal('ambiguous &amp;amp; does need escaping')
    expect(esc('ambiguous &xxyzy; does need escaping', '&"')).to.equal('ambiguous &amp;xxyzy; does need escaping')
    expect(esc('ambiguous &#39; does need escaping', '&"')).to.equal('ambiguous &amp;#39; does need escaping')
    expect(esc('ambiguous &#x34; does need escaping', '&"')).to.equal('ambiguous &amp;#x34; does need escaping')
    expect(esc('ambiguous &Ograve does need escaping', '&"')).to.equal('ambiguous &amp;Ograve does need escaping')
    expect(esc('ambiguous &LT does need escaping', '&"')).to.equal('ambiguous &amp;LT does need escaping')
    expect(esc('unambiguous &-; doesn’t need escaping', '&"')).to.equal('unambiguous &-; doesn’t need escaping')
    expect(esc('unambiguous &WHAtevERmAn doesn’t need escaping', '&"')).to.equal('unambiguous &WHAtevERmAn doesn’t need escaping')
  })

  it('handles unicode', () => {
    for (const string of Object.values(unicode)) {
      expect(esc(string, '&"<>\'')).to.equal(string)
    }
  })
})
