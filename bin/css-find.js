#!/usr/bin/env node

var usage = [
   ''
  , '  Usage: css-find [options] [file path | url] [css prop]'
  , ''
  , '  Example: '
  , '    css-find  ./index.css z-index'
  , '    css-find  http://www.douban.com z-index'
  , ''
  , '  Options:'
  , ''
  , '    -l, --values-with-matches  Only print values that don\'t contain selectors'
  , '    -h, --help, help           Help'
  , ''
].join('\n');

var finder = require('../lib/css-find')
  , args = process.argv.slice(2)
  , fs = require('fs')
  , clc = require('cli-color')
  , prop
  , files = []
  , url = ''
  , valuesWithMatches

var req = require('request')


if (!args.length) {
  args.push('help')
}

var rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

while (args.length) {
  arg = args.shift()
  switch(arg) {
    case '-h':
    case '--help':
    case 'help':
      console.error(usage);
      process.exit(1);

    case '-l':
    case '--values-with-matches':
      valuesWithMatches = true
      break;

    default:
      if (files.length || url) {
        prop = arg
        break;
      }

      if (rUrl.test(arg)) {
        url = arg
      } else {
        files.push(arg)
      }
  }
}

var Q = require("q")
  , stringDfd = Q.defer()

if (url) {

  req.get(url, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      console.log(error || 'statusCode: ' + response.statusCode)
      return
    }

    var cheerio = require('cheerio')
      , $ = cheerio.load(body)

    var stylesheets = $('link').filter(function() {
      return $(this).is('link[rel="stylesheet"]')
    }).map(function() {
      return $(this).attr('href')
    }).toArray()

    console.log(clc.green('Searching in...'))
    console.log(stylesheets)

    if (!stylesheets.length) { return }

    var stylesheetDfds = []
      , rStartWithSlash = /^(\/*)/
      , rEndWithSlash = /\/$/

    stylesheets.forEach(function(stylesheet) {
      var deferred = Q.defer()
        , isRelativeUrl = !/^http/.test(stylesheet)

      if (isRelativeUrl) {
        stylesheet = [url.replace(rEndWithSlash, '')
          , stylesheet.replace(rStartWithSlash, '')].join('/')
      }

      req.get(stylesheet, function(error, response, body) {
        if (error || response.statusCode !== 200) {
          console.log(error || 'statusCode: ' + response.statusCode)
          return deferred.resolve('')
        }
        deferred.resolve(body)
      })

      stylesheetDfds.push(deferred.promise)
    })

    var slice = Array.prototype.slice
    Q.all(stylesheetDfds).done(function() {
      var string = slice.call(arguments).join('\n')
      stringDfd.resolve(string)
    })
  })

} else {
  var str = ''

  files.forEach(function(filePath) {
    str += fs.readFileSync(filePath, 'utf-8')
  })

  stringDfd.resolve(str)
}


stringDfd.promise.done(function(string) {
  var results = finder.search(string, prop)

  if (!results) { return }

  results.forEach(function(result) {
    console.log(clc.green(prop + ':' + result.value))
    if (valuesWithMatches) { return }
    result.selectors.forEach(function(selector, index) {
      console.log(' ' +(index + 1) + ') ' + selector.replace('\n', ' '))
    })
  })
})
