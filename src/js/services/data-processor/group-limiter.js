const R = require("ramda")

module.exports = function(limit, combineRemainder, data) {
  if (!limit) return data
  if (typeof data === "string") return data

  return R.pipe(
    R.splitAt(limit),
    function(split) {
      if (!combineRemainder) return split[0]
      const other = R.pipe(
        R.takeLast(data.length - limit),
        R.map(R.prop("reducer")),
        R.sum
      )(data)

      return split[0].concat([{name: "Other", reducer: other}])
    }
  )(data)
}
