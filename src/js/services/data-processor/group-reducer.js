const R = require("ramda")

const reducerMap = {
  getLength(reducer, groupItems) {
    return groupItems.length
  },
}

module.exports = function(reducer, data) {
  if (!reducer || !reducerMap[reducer.name]) return data

  return R.pipe(
    R.toPairs,
    R.reduce(function(acc, pair) {
      acc[pair[0]] = {
        result: reducerMap[reducer.name](reducer, pair[1]),
        count: pair[1].length,
      }

      return acc
    }, {})
  )(data)
}
