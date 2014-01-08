#!/usr/bin/env node

var finder = require('../lib/css-find')
  , args = process.argv.slice(2)
  , fs = require('fs')
  , clc = require('cli-color')
  , prop
  , files = []
  , valuesWithMatches

var usage = [
   ''
  , '  Usage: css-find [options] [file path] [css prop]'
  , ''
  , '  Example: css-find  ./index.css z-index'
  , ''
  , '  Options:'
  , ''
  , '    -l, --values-with-matches  Only print values that don\'t contain selectors'
  , '    -h, --help, help           Help'
  , ''
].join('\n');

if (!args.length) {
  args.push('help')
}

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
