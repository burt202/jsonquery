const R = require("ramda")

const filter = require("./filter")
const sort = require("./sorter")
const grouper = require("./grouper")
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
  groupProcessor(showCounts, groupSort, groupLimit, combineRemainder, grouped) {
    return R.pipe(
      function(data) {
        const reducer = (showCounts) ? {name: "getLength"} : null
        return groupReducer(reducer, data)
      },
      function(data) {
        return groupSorter(groupSort, data)
      },
      function(data) {
        return groupLimiter(groupLimit, combineRemainder, data)
      },
      R.reduce(function(acc, val) {
        const groupingResult = (Array.isArray(val.data)) ? val.data : val.data.result
        acc[val.name] = groupingResult
        return acc
      }, {})
    )(grouped)
  },
}
