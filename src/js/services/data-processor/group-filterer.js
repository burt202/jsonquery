const R = require("ramda")

module.exports = (filter, data) => {
  if (!filter) return data

  return R.pipe(
    R.toPairs,
    R.reduce((acc, pair) => {
      if (filter.operator === "eq" && pair[1].length === filter.value) {
        acc[pair[0]] = pair[1]
      }

      if (filter.operator === "lt" && pair[1].length < filter.value) {
        acc[pair[0]] = pair[1]
      }

      if (filter.operator === "lte" && pair[1].length <= filter.value) {
        acc[pair[0]] = pair[1]
      }

      if (filter.operator === "gt" && pair[1].length > filter.value) {
        acc[pair[0]] = pair[1]
      }

      if (filter.operator === "gte" && pair[1].length >= filter.value) {
        acc[pair[0]] = pair[1]
      }

      return acc
    }, {}),
  )(data)
}
