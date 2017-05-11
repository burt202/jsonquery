const R = require("ramda")

function _makeCountRowCsvSafe(pair) {
  return [_makeCsvSafe(pair[0]), pair[1]]
}

function _makeCsvSafe(value) {
  if (Array.isArray(value)) return "\"" + value.join(",") + "\""
  if (R.is(String, value) && value.indexOf(",") >= 0) return "\"" + value + "\""
  return value
}

function csvFromObject(json) {
  return R.pipe(
    R.toPairs,
    R.map(R.join(",")),
    R.join("\r\n")
  )(json)
}

function _turnObjIntoCountArray(obj) {
  return R.pipe(
    R.toPairs,
    R.map(function(pair) {
      if (Array.isArray(pair[1])) return R.map(function(count) {
        const split = R.split(": ", count)
        return pair[0] + " - " + split[0] + ": " + split[1]
      }, pair[1])

      return _turnObjIntoCountArray(pair[1])
    }),
    R.flatten
  )(obj)
}

function csvFromCounts(json) {
  if (!Array.isArray(json)) json = _turnObjIntoCountArray(json)

  return R.pipe(
    R.map(R.compose(R.join(","), _makeCountRowCsvSafe, R.split(": "))),
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
        const key = pair[0] + " - " + val[0]
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

module.exports = {
  json: R.curry(function(groupings, showCounts, sumedOrAveraged, json) {
    return JSON.stringify(json, null, 2)
  }),

  csv: R.curry(function(groupings, showCounts, sumedOrAveraged, json) {
    if (R.isEmpty(json)) return null
    if (sumedOrAveraged) return csvFromObject(json)
    if (showCounts) return csvFromCounts(json)
    if (groupings.length && !showCounts) return csvFromGroupedData(json)
    return csvFromArray(json)
  }),
}
