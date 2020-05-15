const R = require("ramda")
const utils = require("../../utils")

const analysisByType = {
  string: ["mostCommonValue"],
  number: ["lowest", "highest", "sum", "average", "median", "mode"],
  bool: [],
  date: ["earliestDate", "latestDate"],
  time: [],
  array: ["highestLength", "averageLength", "mostCommonValue"],
}

const funcs = {
  lowest: values => utils.getMin(values),
  highest: values => utils.getMax(values),
  sum: values => utils.round(2, R.sum(values)),
  average: values => utils.round(2, R.mean(values)),
  median: values => utils.round(2, R.median(values)),
  mode: values => utils.getMode(values),
  earliestDate: values => R.compose(R.head, arr => arr.sort())(values),
  latestDate: values => R.compose(R.head, R.reverse, arr => arr.sort())(values),
  highestLength: values => R.compose(utils.getMax, R.map(R.length))(values),
  averageLength: values => R.compose(utils.round(2), R.mean, R.map(R.length))(values),
  mostCommonValue: values => R.compose(utils.getMode, R.flatten, R.map(R.identity))(values),
}

module.exports = function(type, field, data) {
  const values = R.pluck(field, data)

  return R.reduce(
    function(acc, val) {
      acc[val] = funcs[val](values)
      return acc
    },
    {},
    analysisByType[type],
  )
}
