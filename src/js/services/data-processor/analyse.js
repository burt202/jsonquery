const R = require("ramda")
const utils = require("../../utils")

const analysisByType = {
  string: [],
  number: ["sum", "average", "lowest", "highest", "median"],
  bool: [],
  date: [],
  time: [],
  array: [],
}

const funcs = {
  sum: (values) => utils.round(2, R.sum(values)),
  average: (values) => utils.round(2, R.mean(values)),
  lowest: (values) => utils.getMin(values),
  highest: (values) => utils.getMax(values),
  median: (values) => utils.round(2, R.median(values)),
}

module.exports = function(type, field, data) {
  const values = R.pluck(field, data)

  return R.reduce(function(acc, val) {
    acc[val] = funcs[val](values)
    return acc
  }, {}, analysisByType[type])
}
