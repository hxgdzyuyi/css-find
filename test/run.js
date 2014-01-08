var should = require('should')
  , finder = require('../lib/css-find')
  , fs = require('fs')

describe('should find right prop', function(){
  var string = fs.readFileSync(__dirname
    + '/../fixture/find-prop.css', 'utf-8')

  it('find `z-index`', function() {
    var expected =
          [ { value: '12'
            , selectors: [ '.z-index12' ] }

          , { value: '13'
            , selectors: [ '.red .z-index12,\n.wrapper', '.z-index13' ] }
          ]

    finder.search(string, 'z-index')
      .should.eql(expected)
  })

  it('find `font-size`', function() {
    var expected =
          [ { value: '12px'
            , selectors: [ '.z-index13' ] }

          , { value: '13px'
            , selectors: [ '.red .z-index12,\n.wrapper' ] }
          ]

    finder.search(string, 'font-size')
      .should.eql(expected)
  })
})
