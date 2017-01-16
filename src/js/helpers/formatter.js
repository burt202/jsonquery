const R = require("ramda")
const moment = require("moment")

const isSame = R.curry(function(filterValue, dataValue) {
  return moment(dataValue).isSame(filterValue, "day")
})

const isBefore = R.curry(function(filterValue, dataValue) {
  return moment(dataValue).isBefore(filterValue)
})

const isAfter = R.curry(function(filterValue, dataValue) {
  return moment(dataValue).isAfter(filterValue)
})

const isOneOf = R.curry(function(filterValue, dataValue) {
  dataValue = (dataValue) ? dataValue.toString() : ""
  return R.compose(R.contains(dataValue), R.split(","), R.defaultTo(""))(filterValue)
})

const matches = R.curry(function(filterValue, dataValue) {
  const regParts = filterValue.match(/^\/(.*?)\/([gim]*)$/)
  const regex = (regParts) ? new RegExp(regParts[1], regParts[2]) : new RegExp(filterValue)
  return R.test(regex, dataValue)
})

const round = R.curry(function(decimals, num) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
})

function getMax(arr) {
  return Math.max.apply(null, arr)
}

function getMin(arr) {
  return Math.min.apply(null, arr)
}

const getMode = R.compose(
  R.map(parseInt),
  R.map(R.head),
  R.defaultTo([]),
  R.converge(R.prop, [
    R.compose(R.last, R.sortBy(parseInt), R.keys),
    R.identity,
  ]),
  R.groupBy(R.last),
  R.toPairs,
  R.countBy(R.identity)
)

function addStringFilter(filter) {
  const acc = {}
  if (filter.operator === "eq") acc[filter.name] = R.equals(filter.value)
  if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(filter.value))
  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "nnl") acc[filter.name] = R.compose(R.not, R.isNil)
  if (filter.operator === "iof") acc[filter.name] = isOneOf(filter.value)
  if (filter.operator === "rgm") acc[filter.name] = matches(filter.value)
  return acc
}

function addIntFilter(filter) {
  const acc = {}
  if (filter.operator === "eq") acc[filter.name] = R.equals(parseFloat(filter.value))
  if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(parseFloat(filter.value)))
  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "nnl") acc[filter.name] = R.compose(R.not, R.isNil)
  if (filter.operator === "gt") acc[filter.name] = R.gt(R.__, parseFloat(filter.value))
  if (filter.operator === "lt") acc[filter.name] = R.lt(R.__, parseFloat(filter.value))
  if (filter.operator === "gte") acc[filter.name] = R.gte(R.__, parseFloat(filter.value))
  if (filter.operator === "lte") acc[filter.name] = R.lte(R.__, parseFloat(filter.value))
  if (filter.operator === "iof") acc[filter.name] = isOneOf(filter.value)
  return acc
}

function addBoolFilter(filter) {
  const acc = {}
  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "true") acc[filter.name] = R.equals(true)
  if (filter.operator === "false") acc[filter.name] = R.equals(false)
  return acc
}

function addDateFilter(filter) {
  const acc = {}
  if (filter.value.length === 8 && moment(filter.value, "YYYYMMDD").isValid()) {
    if (filter.operator === "eq") acc[filter.name] = isSame(filter.value)
    if (filter.operator === "be") acc[filter.name] = isBefore(filter.value)
    if (filter.operator === "af") acc[filter.name] = isAfter(filter.value)
  }

  if (filter.operator === "nl") acc[filter.name] = R.isNil
  if (filter.operator === "nnl") acc[filter.name] = R.compose(R.not, R.isNil)
  return acc
}

module.exports = {
  filter: function(data, schema, filters) {
    const builtFilters = R.reduce(function(acc, filter) {
      if (!filter.active) return acc

      const type = schema[filter.name]

      if (type === "string") acc = R.merge(acc, addStringFilter(filter))
      if (type === "int") acc = R.merge(acc, addIntFilter(filter))
      if (type === "bool") acc = R.merge(acc, addBoolFilter(filter))
      if (type === "date") acc = R.merge(acc, addDateFilter(filter))

      return acc
    }, {}, filters)

    return R.filter(R.where(builtFilters), data)
  },

  group: function(filtered, groupBy) {
    return R.groupBy(R.prop(groupBy), filtered)
  },

  sort: function(filtered, sortBy, sortDirection) {
    const sorted = R.sortBy(R.prop(sortBy), filtered)
    if (sortDirection === "desc") return R.reverse(sorted)
    return sorted
  },

  getGroupStats: function(grouped) {
    const groupLengths = R.pipe(
      R.toPairs,
      R.map(function(pair) {
        return pair[1].length
      })
    )(grouped)

    const count = {name: "Count", value: Object.keys(grouped).length}
    const max = {name: "Max Size", value: getMax(groupLengths)}
    const min = {name: "Min Size", value: getMin(groupLengths)}
    const mean = {name: "Mean Size", value: R.compose(round(2), R.mean)(groupLengths)}
    const median = {name: "Median Size", value: R.compose(round(2), R.median)(groupLengths)}
    const mode = {name: "Mode Size", value: getMode(groupLengths).join(", ")}

    const stats = {count: count}

    return (count.value) ? R.merge(stats, {
      max: max,
      min: min,
      mean: mean,
      median: median,
      mode: mode,
    }) : stats
  },
}
