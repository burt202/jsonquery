const R = require("ramda")
const flat = require("flat")

function _makeCsvSafe(value) {
  if (Array.isArray(value)) return `"${value.join(",")}"`
  if (R.is(String, value) && value.indexOf(",") >= 0) return `"${value}"`
  if (R.is(Object, value)) return JSON.stringify(value)
  return value
}

function csvFromArray(json) {
  const header = R.keys(json[0]).join(",")

  return R.pipe(
    R.map(function(row) {
      return R.compose(R.join(","), R.map(_makeCsvSafe), R.values)(row)
    }),
    R.prepend(header),
    R.join("\r\n")
  )(json)
}

function csvFromObject(json) {
  return R.pipe(
    R.toPairs,
    R.map(R.compose(R.join(","), R.map(_makeCsvSafe))),
    R.join("\r\n")
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
    R.uniq,
    R.join(",")
  )(obj)
}

function _getGroupedData(obj) {
  return R.pipe(
    R.toPairs,
    R.map(function(pair) {
      if (Array.isArray(pair[1])) return [_makeCsvSafe(pair[0])]
        .concat(R.map(R.compose(R.join(","), R.map(_makeCsvSafe), R.values), pair[1]))

      return _getGroupedData(R.reduce(function(acc, val) {
        const key = `${pair[0]} - ${val[0]}`
        acc[key] = val[1]
        return acc
      }, {}, R.toPairs(pair[1])))
    }),
    R.flatten
  )(obj)
}

function csvFromGroupedData(json) {
  const header = _getHeader(json)

  return R.pipe(
    _getGroupedData,
    R.prepend(header),
    R.join("\r\n")
  )(json)
}

module.exports = {
  json: R.curry(function(groupings, showCounts, json) {
    return JSON.stringify(json, null, 2)
  }),

  table: R.curry(function(groupings, showCounts, json) {
    if (R.isEmpty(json)) return null
    if (Array.isArray(json)) return csvFromArray(json)
    if (showCounts) return `name,count\r\n${csvFromObject(flat(json, {delimiter: " - "}))}`
    if (groupings.length) return csvFromGroupedData(json)
    return csvFromObject(json)
  }),
}
