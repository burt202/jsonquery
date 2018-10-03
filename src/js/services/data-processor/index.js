const R = require("ramda")

const filter = require("./filter")
const sort = require("./sorter")
const grouper = require("./grouper")
const analyse = require("./analyse")
const groupReducer = require("./group-reducer")
const groupSorter = require("./group-sorter")
const groupLimiter = require("./group-limiter")

module.exports = {
  filter,
  sort,
  limit(limit, data) {
    return R.take(this.props.limit, data)
  },
  group: grouper,
  analyse,
  groupProcessor(reducer, sortBy, limit, combineRemainder, grouped) {
    return R.pipe(
      function(data) {
        return groupReducer(reducer, data)
      },
      function(data) {
        return groupSorter(sortBy, data)
      },
      function(data) {
        return groupLimiter(limit, combineRemainder, data)
      },
      function(data) {
        if (typeof data === "string") return data

        return R.reduce(function(acc, val) {
          acc[val.name] = val.reducer
          return acc
        }, {}, data)
      }
    )(grouped)
  },
}
