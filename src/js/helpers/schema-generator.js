const R = require("ramda")
const validator = require("./validator")

module.exports = {
  generate: function(data) {
    return R.pipe(
      R.toPairs,
      R.reduce(function(acc, pair) {
        acc[pair[0]] = "string"

        if (pair[1] !== null && pair[1] !== undefined) {
          if (/^([0-9]{4})-([0-9]{2})/.test(pair[1]) && validator.isValidDate(pair[1])) acc[pair[0]] = "date"
          if (validator.isNumber(pair[1])) acc[pair[0]] = "number"
          if (validator.isBool(pair[1])) acc[pair[0]] = "bool"
          if (validator.isArray(pair[1])) acc[pair[0]] = "array"
        }

        return acc
      }, {})
    )(data)
  },
}
