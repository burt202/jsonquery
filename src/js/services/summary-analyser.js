const R = require("ramda")

const utils = require("../utils")

module.exports = {
  getFilteredTotal(filtered, rawDataLength) {
    const percentage = utils.round(2, (filtered.length / rawDataLength) * 100)
    return {name: "Filtered", value: `${filtered.length} (${percentage}%)`}
  },

  getGroupLimitedTotal(filtered, rawDataLength, sortedGroups) {
    const groupedTotal = R.compose(R.sum, R.values)(sortedGroups)
    const absolutePercentage = utils.round(2, (groupedTotal / rawDataLength) * 100)
    const relativePercentage = utils.round(2, (groupedTotal / filtered.length) * 100)
    const relativePercentageTitle = `Relative to filtered data: ${relativePercentage}%`
    return {name: "Group Limited", title: relativePercentageTitle, value: `${groupedTotal} (${absolutePercentage}%)`}
  },

  getGroupingAnalysis(grouped) {
    const groupLengths = R.compose(R.map(R.length), R.values)(grouped)

    const count = {name: "No. of Groups", value: groupLengths.length}
    const max = {name: "Max Group Size", value: utils.getMax(groupLengths)}
    const min = {name: "Min Group Size", value: utils.getMin(groupLengths)}
    const mean = {name: "Average Group Size", value: R.compose(utils.round(2), R.mean)(groupLengths)}

    return (count.value) ? [count, max, min, mean] : []
  },
}
