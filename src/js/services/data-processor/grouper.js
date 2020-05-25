const R = require("ramda")
const flat = require("flat")

const _group = R.curry((groupings, data) => {
  data = R.groupBy(R.prop(groupings[0]), data)
  groupings = R.tail(groupings)
  if (!groupings.length) return data

  return R.map(_group(groupings), data)
})

module.exports = (groupings, data) => {
  if (!groupings || !groupings.length) return data
  const groups = _group(groupings, data)
  return flat(groups, {delimiter: " - ", maxDepth: groupings.length})
}
