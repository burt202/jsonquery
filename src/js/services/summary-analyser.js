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
  getFilteredTotal(filtered, rawDataLength) {
    const percentage = utils.round(2, (filtered.length / rawDataLength) * 100)
    return {name: "Filtered", value: `${filtered.length} (${percentage}%)`}
  },

  getGroupLimitedTotal(filtered, rawDataLength, sortedGroups) {
    const groupedTotal = R.compose(R.length, R.flatten, R.pluck("count"))(sortedGroups)
    const absolutePercentage = utils.round(2, (groupedTotal / rawDataLength) * 100)
    const relativePercentage = utils.round(2, (groupedTotal / filtered.length) * 100)
    const relativePercentageTitle = `Relative to filtered data: ${relativePercentage}%`
    return {name: "Group Limited", title: relativePercentageTitle, value: `${groupedTotal} (${absolutePercentage}%)`}
  },

  getGroupingAnalysis(grouped) {
    const groupLengths = _getGroupLengths(grouped)

    const count = {name: "No. of Groups", value: groupLengths.length}
    const max = {name: "Max Group Size", value: utils.getMax(groupLengths)}
    const min = {name: "Min Group Size", value: utils.getMin(groupLengths)}
    const mean = {name: "Average Group Size", value: R.compose(utils.round(2), R.mean)(groupLengths)}

    return (count.value) ? [count, max, min, mean] : []
  },
}
