const R = require("ramda")
const flat = require("flat")

const validator = require("./validator")
const utils = require("../utils")

const parse = require("date-fns/parse")
const isValid = require("date-fns/is_valid")
const isDateBefore = require("date-fns/is_before")
const isDateAfter = require("date-fns/is_after")
const isWithinRange = require("date-fns/is_within_range")
const isSameDay = require("date-fns/is_same_day")

function isValidDate(date) {
  return isValid(parse(date))
}

const isSameDayAs = R.curry(function(filterValue, dataValue) {
  return isSameDay(filterValue, dataValue)
})

const isBefore = R.curry(function(filterValue, dataValue) {
  return isDateBefore(dataValue, filterValue)
})

const isAfter = R.curry(function(filterValue, dataValue) {
  return isDateAfter(dataValue, filterValue)
})

const isBetweenDates = R.curry(function(start, end, dataValue) {
  return isWithinRange(dataValue, start, end)
})

const isOneOf = R.curry(function(filterValue, dataValue) {
  dataValue = (!R.isNil(dataValue)) ? dataValue.toString() : ""
  return R.compose(R.contains(dataValue), R.split(","), R.defaultTo(""))(filterValue)
})

const isBetween = R.curry(function(start, end, dataValue) {
  return R.allPass([R.gt(R.__, start), R.lt(R.__, end)])(dataValue)
})

const matches = R.curry(function(filterValue, dataValue) {
  const regParts = filterValue.match(/^\/(.*?)\/([gim]*)$/)
  const regex = (regParts) ? new RegExp(regParts[1], regParts[2]) : new RegExp(filterValue)
  return R.test(regex, dataValue)
})

function getStringFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(filter.value)
    if (filter.operator === "neq") return R.compose(R.not, R.equals(filter.value))
    if (filter.operator === "iof") return isOneOf(filter.value)
    if (filter.operator === "inof") return R.compose(R.not, isOneOf(filter.value))
    if (filter.operator === "rgm") return matches(filter.value)
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getNumberFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(parseFloat(filter.value))
    if (filter.operator === "neq") return R.compose(R.not, R.equals(parseFloat(filter.value)))
    if (filter.operator === "gt") return R.gt(R.__, parseFloat(filter.value))
    if (filter.operator === "gte") return R.gte(R.__, parseFloat(filter.value))
    if (filter.operator === "lt") return R.lt(R.__, parseFloat(filter.value))
    if (filter.operator === "lte") return R.lte(R.__, parseFloat(filter.value))
    if (filter.operator === "iof") return isOneOf(filter.value)
    if (filter.operator === "inof") return R.compose(R.not, isOneOf(filter.value))

    if (filter.value1 && filter.value1.length) {
      if (filter.operator === "btw") return isBetween(parseFloat(filter.value), parseFloat(filter.value1))
    }
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getBoolFilter(filter) {
  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)
  if (filter.operator === "true") return R.equals(true)
  if (filter.operator === "false") return R.equals(false)

  return null
}

function getDateFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(filter.value)
    if (filter.operator === "neq") return R.compose(R.not, R.equals(filter.value))

    if (filter.value.length >= 8 && isValidDate(filter.value)) {
      if (filter.operator === "sd") return isSameDayAs(filter.value)
      if (filter.operator === "be") return isBefore(filter.value)
      if (filter.operator === "af") return isAfter(filter.value)
    }

    if (filter.value1 && filter.value1.length >= 8 && isValidDate(filter.value1)) {
      if (filter.operator === "btw") return isBetweenDates(filter.value, filter.value1)
    }
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getTimeFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "eq") return R.equals(filter.value)
    if (filter.operator === "neq") return R.compose(R.not, R.equals(filter.value))

    if (filter.value.length >= 5 && validator.isValidTime(filter.value)) {
      if (filter.operator === "be") return R.gt(filter.value)
      if (filter.operator === "af") return R.lt(filter.value)
    }

    if (filter.value1 && filter.value1.length >= 5 && validator.isValidTime(filter.value1)) {
      if (filter.operator === "btw") return isBetween(filter.value, filter.value1)
    }
  }

  if (filter.operator === "nl") return R.isNil
  if (filter.operator === "nnl") return R.compose(R.not, R.isNil)

  return null
}

function getArrayFilter(filter) {
  if (filter.value && filter.value.length) {
    if (filter.operator === "cos") return R.contains(filter.value)
    if (filter.operator === "con") return R.contains(parseFloat(filter.value))
    if (filter.operator === "hl") return R.compose(R.equals(parseInt(filter.value, 10)), R.length)
    if (filter.operator === "dhl") return R.compose(R.not, R.equals(parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hlgt") return R.compose(R.gt(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hlgte") return R.compose(R.gte(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hllt") return R.compose(R.lt(R.__, parseInt(filter.value, 10)), R.length)
    if (filter.operator === "hllte") return R.compose(R.lte(R.__, parseInt(filter.value, 10)), R.length)
  }

  return null
}

const _group = R.curry(function(groupings, showCounts, data) {
  data = R.groupBy(R.prop(groupings[0]), data)
  groupings = R.tail(groupings)
  if (!groupings.length) return (showCounts) ? R.map(R.length, data) : data

  return R.map(_group(groupings, showCounts), data)
})

function formatFilters(filters) {
  return R.pipe(
    R.toPairs,
    R.reduce(function(acc, pair) {
      acc[pair[0]] = R.allPass(pair[1])
      return acc
    }, {})
  )(filters)
}

function isNumeric(num) {
  return !isNaN(num)
}

const naturalOrders = [
  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
]

module.exports = {
  filter(data, schema, filters) {
    const builtFilters = R.reduce(function(acc, filter) {
      if (!filter.active) return acc

      const type = schema[filter.name]
      let filterMethod = null

      if (type === "string") filterMethod = getStringFilter(filter)
      if (type === "number") filterMethod = getNumberFilter(filter)
      if (type === "bool") filterMethod = getBoolFilter(filter)
      if (type === "date") filterMethod = getDateFilter(filter)
      if (type === "time") filterMethod = getTimeFilter(filter)
      if (type === "array") filterMethod = getArrayFilter(filter)

      if (filterMethod) {
        if (!acc[filter.name]) acc[filter.name] = []
        acc[filter.name].push(filterMethod)
      }

      return acc
    }, {}, filters)

    return R.filter(R.where(formatFilters(builtFilters)), data)
  },

  group(groupings, showCounts, flatten, data) {
    const groups = _group(groupings, showCounts, data)
    if (flatten) return flat(groups, {delimiter: " - ", maxDepth: groupings.length})
    return groups
  },

  sort(sorters, data) {
    return R.sortWith(R.map(function(sorter) {
      const direction = (sorter.direction === "asc") ? "ascend" : "descend"
      return R[direction](R.prop(sorter.field))
    }, sorters), data)
  },

  sortAndLimitObject(sortField, limit, data) {
    let sorters = [R.descend(R.prop("count"))]
    if (sortField === "asc") sorters = [R.ascend(R.prop("count"))]
    if (sortField === "nameasc") sorters = [R.ascend(R.prop("name"))]
    if (sortField === "namedesc") sorters = [R.descend(R.prop("name"))]
    if (sortField === "pathdesc") sorters = [R.ascend(R.prop("path")), R.descend(R.prop("count"))]
    if (sortField === "pathasc") sorters = [R.ascend(R.prop("path")), R.ascend(R.prop("count"))]

    const keysAreNumbers = R.all(isNumeric)(Object.keys(data))
    let totalCount = 0

    if (sortField === "natural") {
      const fieldsString = R.compose(R.join(""), R.sort(R.ascend(R.identity)), R.keys)(data)

      const matcher = R.find(function(orders) {
        return R.compose(R.join(""), R.sort(R.ascend(R.identity)))(orders) === fieldsString
      }, naturalOrders)

      if (matcher) {
        sorters = [function(a, b) {
          return matcher.indexOf(a.name) - matcher.indexOf(b.name)
        }]
      }
    }

    return R.pipe(
      R.toPairs,
      R.map(function(pair) {
        const path = R.compose(R.join(","), R.init, R.split(" - "))(pair[0])
        const name = (keysAreNumbers) ? parseFloat(pair[0]) : pair[0]
        return {name, path, count: pair[1]}
      }),
      R.sortWith(sorters),
      R.take(limit || data.length),
      R.tap(function(d) {
        totalCount = R.compose(R.sum, R.pluck("count"))(d)
      }),
      R.map(function(row) {
        const percentage = utils.round(2, (row.count / totalCount) * 100)
        return R.compose(R.assoc("percentage", percentage), R.pick(["name", "count"]))(row)
      })
    )(data)
  },
}
