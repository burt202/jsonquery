const R = require("ramda")
const flat = require("flat")

function _makeCsvSafe(value) {
  if (R.is(String, value) && value.indexOf(",") >= 0) return `"${value}"`
  return value
}

function _makeTableSafe(value) {
  if (Array.isArray(value)) return value.join(",")
  if (R.is(Object, value)) return JSON.stringify(value)
  return value
}

function tableFromArray(json) {
  const header = {type: "header", cols: R.keys(json[0])}

  return R.pipe(
    R.map(function(row) {
      return {type: "data", cols: R.compose(R.map(_makeTableSafe), R.values)(row)}
    }),
    R.prepend(header)
  )(json)
}

function tableFromObject(json) {
  return R.pipe(
    R.toPairs,
    R.map(function(row) {
      return {type: "data", cols: R.map(_makeTableSafe)(row)}
    })
  )(json)
}

function _getHeader(obj) {
  return R.pipe(
    R.toPairs,
    R.map(function(pair) {
      if (Array.isArray(pair[1])) return R.compose(R.keys, R.head)(pair[1])
      return _getHeader(pair[1])
    }),
    R.flatten,
    R.uniq
  )(obj)
}

function _getGroupedData(obj) {
  return R.pipe(
    R.toPairs,
    R.map(function(pair) {
      if (Array.isArray(pair[1])) {
        const span = R.keys(pair[1][0]).length

        return [{type: "title", cols: [_makeTableSafe(pair[0])], span}]
          .concat(R.map(R.compose(function(cols) {
            return {type: "data", cols}
          }, R.map(_makeTableSafe), R.values), pair[1]))
      }

      return _getGroupedData(R.reduce(function(acc, val) {
        const key = `${pair[0]} - ${val[0]}`
        acc[key] = val[1]
        return acc
      }, {}, R.toPairs(pair[1])))
    }),
    R.flatten
  )(obj)
}

function tableFromGroupedData(json) {
  const header = {type: "header", cols: R.map(_makeTableSafe, _getHeader(json))}

  return R.pipe(
    _getGroupedData,
    R.prepend(header)
  )(json)
}

const formatters = {
  json: R.curry(function(groupings, showCounts, json) {
    return JSON.stringify(json, null, 2)
  }),

  table: R.curry(function(groupings, showCounts, json) {
    if (R.isEmpty(json)) return []
    if (Array.isArray(json)) return tableFromArray(json)
    if (showCounts) return [{type: "header", cols: ["name", "count"]}]
      .concat(tableFromObject(flat(json, {delimiter: " - "})))
    if (groupings.length) return tableFromGroupedData(json)
    return tableFromObject(json)
  }),

  csv: R.curry(function(groupings, showCounts, json) {
    if (R.isEmpty(json)) return null
    const rows = formatters.table(groupings, showCounts, json)

    return R.pipe(
      R.map(R.compose(R.join(","), R.map(_makeCsvSafe), R.prop("cols"))),
      R.join("\r\n")
    )(rows)
  }),
}

module.exports = formatters
