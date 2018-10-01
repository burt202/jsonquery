const R = require("ramda")

module.exports = function(limit, combineRemainder, data) {
  if (!limit) return data

  return R.pipe(
    R.splitAt(limit),
    function(split) {
      if (!combineRemainder) return split[0]
      return split[0]
    }
  )(data)
}
