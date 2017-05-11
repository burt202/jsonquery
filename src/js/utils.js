const R = require("ramda")

module.exports = {
  round: R.curry(function(decimals, num) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }),

  updateWhere: function(find, update, data) {
    const index = R.findIndex(R.whereEq(find), data)
    return R.adjust(R.merge(R.__, update), index, data)
  },
}
