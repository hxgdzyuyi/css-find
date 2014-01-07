#!/usr/bin/env node

var finder = require('../lib/css-find')
  , args = process.argv.slice(2)
  , fs = require('fs')
  , clc = require('cli-color')
  , prop
  , files = []

while (args.length) {
  arg = args.shift()
  switch(arg) {
    case '-f':
    case '--css-file':
      files.push(args.shift())
      break;
    default:
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
  result.selectors.forEach(function(selector, index) {
    console.log(' ' +(index + 1) + ') ' + selector.replace('\n', ' '))
  })
})
