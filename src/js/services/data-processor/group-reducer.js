const R = require("ramda")
const utils = require("../../utils")

const reducerMap = {
  getLength(reducer, totalItemCount, groupItems) {
    return groupItems.length
  },
  getPercentage(reducer, totalItemCount, groupItems) {
    return utils.round(2, (groupItems.length / totalItemCount) * 100)
  },
}

module.exports = function(reducer, data) {
  if (!reducer || !reducerMap[reducer.name]) return data
  const totalItemCount = R.compose(R.length, R.flatten, R.values)(data)

  return R.pipe(
    R.toPairs,
    R.reduce(function(acc, pair) {
      acc[pair[0]] = {
        reducer: reducerMap[reducer.name](reducer, totalItemCount, pair[1]),
        count: pair[1].length,
      }

      return acc
    }, {})
  )(data)
}
