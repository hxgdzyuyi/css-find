var CSSOM = require('cssom/lib/parse')
  , linq = require('linq')
  , _ = require('underscore')

exports.search = function(string, prop) {
  var styleSheet = CSSOM.parse(string)

  if (!styleSheet || !styleSheet.cssRules) { return }

  var Enumerable = linq.From(styleSheet.cssRules)
    , rDigital = /-?\d+/

  var results = Enumerable.Where(function(x) {
    return x.style && !_.isUndefined(x.style[prop])
  }).Select(function(x) {
    return {
      value: x.style[prop]
    , selector: x.selectorText
    }
  }).GroupBy('$.value', '$.selector', function(key, group) {
    return {
      value: key
    , selectors: group.source
    }
  }).OrderBy(function(x) {
    var match = x.value.match(rDigital)
    return match ? +match[0]: x.value
  }).ToArray()

  return results
}
