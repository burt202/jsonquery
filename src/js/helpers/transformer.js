const R = require("ramda")

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

function csvFromObject(json) {
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

module.exports = {
  prettify: function(json) {
    return JSON.stringify(json, null, 2)
  },

  convertToCsv: function(json) {
    if (R.isEmpty(json)) return null
    return R.isArrayLike(json) ? csvFromArray(json) : csvFromObject(json)
  },
}
