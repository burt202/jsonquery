const R = require("ramda")

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
      if (Array.isArray(pair[1])) return R.pipe(
        R.map(function(count) {
          const split = R.split(": ", count)
          return pair[0] + " - " + split[0] + ": " + split[1]
        })
      )(pair[1])

      return _turnObjIntoCountArray(pair[1])
    }),
    R.flatten
  )(obj)
}

function csvFromCounts(json) {
  if (!Array.isArray(json)) json = _turnObjIntoCountArray(json)

  return R.pipe(
    R.map(R.compose(R.join(","), R.split(": "))),
    R.join("\r\n")
  )(json)
}

function csvFromGroupedData(json) {
  const header = R.compose(R.join(","), R.keys, R.head, R.flatten, R.values)(json)

  return R.pipe(
    R.toPairs,
    R.map(function(row) {
      return [row[0]].concat(R.map(R.compose(R.join(","), R.values), row[1]))
    }),
    R.flatten,
    R.prepend(header),
    R.join("\r\n")
  )(json)
}

function csvFromArray(json) {
  const header = R.keys(json[0]).join(",")

  return R.pipe(
    R.map(function(row) {
      return R.values(row).join(",")
    }),
    R.prepend(header),
    R.join("\r\n")
  )(json)
}

module.exports = {
  prettify: R.curry(function(groupings, showCounts, sumedOrAveraged, json) {
    return JSON.stringify(json, null, 2)
  }),

  convertToCsv: R.curry(function(groupings, showCounts, sumedOrAveraged, json) {
    if (R.isEmpty(json)) return null
    if (sumedOrAveraged) return csvFromObject(json)
    if (showCounts) return csvFromCounts(json)
    if (groupings.length && !showCounts) return csvFromGroupedData(json)
    return csvFromArray(json)
  }),
}
