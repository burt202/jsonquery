const R = require("ramda")
const utils = require("../../utils")

const filterTypes = require("./filter-types")

function getComparator(schema, reducer) {
  const filterType = schema[reducer.field]
  const operator = filterType === "bool" ? reducer.value : "eq"
  return filterTypes[filterType](R.merge(reducer, {operator}))
}

const reducerMap = {
  count(schema, reducer, totalItemCount, groupItems) {
    return groupItems.length
  },
  percentage(schema, reducer, totalItemCount, groupItems) {
    return utils.round(2, (groupItems.length / totalItemCount) * 100)
  },
  countCondition(schema, reducer, totalItemCount, groupItems) {
    if (!reducer.field || !reducer.value) return "N/A"
    const comparator = getComparator(schema, reducer)
    return R.compose(R.length, R.filter(comparator), R.pluck(reducer.field))(groupItems)
  },
  percentageCondition(schema, reducer, totalItemCount, groupItems) {
    if (!reducer.field || !reducer.value) return "N/A"
    const comparator = getComparator(schema, reducer)
    const length = R.compose(R.length, R.filter(comparator), R.pluck(reducer.field))(groupItems)
    return utils.round(2, (length / groupItems.length) * 100)
  },
}

module.exports = (schema, reducer, data) => {
  if (!reducer || !reducerMap[reducer.name]) return data
  const totalItemCount = R.compose(R.length, R.flatten, R.values)(data)

  return R.pipe(
    R.toPairs,
    R.reduce((acc, pair) => {
      acc[pair[0]] = {
        reducer: reducerMap[reducer.name](schema, reducer, totalItemCount, pair[1]),
        count: pair[1].length,
      }

      return acc
    }, {}),
  )(data)
}
