const R = require("ramda")

const utils = require("../utils")

const _getGroupLengths = R.pipe(
  R.toPairs,
  R.map(function(pair) {
    if (Array.isArray(pair[1])) return R.length(pair[1])
    return _getGroupLengths(pair[1])
  }),
  R.flatten
)

module.exports = {
  getAnalysis(grouped) {
    const groupLengths = _getGroupLengths(grouped)

    const count = {name: "No. of Groups", value: groupLengths.length}
    const max = {name: "Max Group Size", value: utils.getMax(groupLengths)}
    const min = {name: "Min Group Size", value: utils.getMin(groupLengths)}
    const mean = {name: "Average Group Size", value: R.compose(utils.round(2), R.mean)(groupLengths)}

    return (count.value) ? [count, max, min, mean] : []
  },
}
