const R = require("ramda")
const utils = require("../../utils")

module.exports = function(field, data) {
  const values = R.pluck(field, data)

  return {
    sum: utils.round(2, R.sum(values)),
    average: utils.round(2, R.mean(values)),
    lowest: utils.getMin(values),
    highest: utils.getMax(values),
    median: utils.round(2, R.median(values)),
  }
}
