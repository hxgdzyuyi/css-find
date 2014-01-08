#!/usr/bin/env node

var finder = require('../lib/css-find')
  , args = process.argv.slice(2)
  , fs = require('fs')
  , clc = require('cli-color')
  , prop
  , files = []
  , valuesWithMatches

while (args.length) {
  arg = args.shift()
  switch(arg) {
    case '-f':
    case '--css-file':
      files.push(args.shift())
      break;

    case '-l':
    case '--values-with-matches':
      valuesWithMatches = true
      break;

    default:
      if (!files.length) {
        files.push(arg)
        break;
      }
      prop = arg
  }
}

var str = ''

files.forEach(function(filePath) {
  str += fs.readFileSync(filePath, 'utf-8')
})

var results = finder.search(str, prop)

if (!results) { return }

results.forEach(function(result) {
  console.log(clc.green(prop + ':' + result.value))
  if (valuesWithMatches) { return }
  result.selectors.forEach(function(selector, index) {
    console.log(' ' +(index + 1) + ') ' + selector.replace('\n', ' '))
  })
})
