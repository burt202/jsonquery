const R = require("ramda")

const filterTypes = require("./filter-types")

function formatFilters(filters) {
  return R.pipe(
    R.toPairs,
    R.reduce((acc, pair) => {
      acc[pair[0]] = R.allPass(pair[1])
      return acc
    }, {}),
  )(filters)
}

module.exports = (data, schema, filters) => {
  const builtFilters = R.reduce(
    (acc, filter) => {
      if (!filter.active) return acc

      const type = schema[filter.name]
      let filterMethod = null

      if (type === "string") filterMethod = filterTypes.string(filter)
      if (type === "number") filterMethod = filterTypes.number(filter)
      if (type === "bool") filterMethod = filterTypes.bool(filter)
      if (type === "date") filterMethod = filterTypes.date(filter)
      if (type === "time") filterMethod = filterTypes.time(filter)
      if (type === "array") filterMethod = filterTypes.array(filter)

      if (filterMethod) {
        if (!acc[filter.name]) acc[filter.name] = []
        acc[filter.name].push(filterMethod)
      }

      return acc
    },
    {},
    filters,
  )

  return R.filter(R.where(formatFilters(builtFilters)), data)
}
