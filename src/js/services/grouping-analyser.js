const R = require("ramda")

const utils = require("../utils")

function getMax(arr) {
  return Math.max.apply(null, arr)
}

function getMin(arr) {
  return Math.min.apply(null, arr)
}

const _getGroupLengths = R.pipe(
  R.toPairs,
  R.map(function(pair) {
    if (Array.isArray(pair[1])) return R.length(pair[1])
    return _getGroupLengths(pair[1])
  }),
  R.flatten
)

module.exports = {
  getAnalysis: function(grouped) {
    const groupLengths = _getGroupLengths(grouped)

    const count = {name: "No. of Groups", value: groupLengths.length}
    const max = {name: "Max Group Size", value: getMax(groupLengths)}
    const min = {name: "Min Group Size", value: getMin(groupLengths)}
    const mean = {name: "Average Group Size", value: R.compose(utils.round(2), R.mean)(groupLengths)}

    return (count.value) ? [count, max, min, mean] : []
  },
}
