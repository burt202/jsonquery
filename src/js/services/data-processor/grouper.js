const R = require("ramda")
const flat = require("flat")

const _group = R.curry(function(groupings, showCounts, data) {
  data = R.groupBy(R.prop(groupings[0]), data)
  groupings = R.tail(groupings)
  if (!groupings.length) return (showCounts) ? R.map(R.length, data) : data

  return R.map(_group(groupings, showCounts), data)
})

module.exports = function(groupings, showCounts, data) {
  const groups = _group(groupings, showCounts, data)
  return flat(groups, {delimiter: " - ", maxDepth: groupings.length})
}
