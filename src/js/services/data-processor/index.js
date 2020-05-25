const R = require("ramda")

const filter = require("./filter")
const sort = require("./sorter")
const grouper = require("./grouper")
const analyse = require("./analyse")
const groupFilterer = require("./group-filterer")
const groupReducer = require("./group-reducer")
const groupSorter = require("./group-sorter")
const groupLimiter = require("./group-limiter")

module.exports = {
  filter,
  sort,
  limit(limit, data) {
    return R.take(limit, data)
  },
  group: grouper,
  analyse,
  groupProcessor(schema, reducer, sortBy, limit, combineRemainder, grouped) {
    return R.pipe(
      data => {
        return groupFilterer(undefined, data)
      },
      data => {
        return groupReducer(schema, reducer, data)
      },
      data => {
        return groupSorter(sortBy, data)
      },
      data => {
        return groupLimiter(limit, combineRemainder, data)
      },
    )(grouped)
  },
}
