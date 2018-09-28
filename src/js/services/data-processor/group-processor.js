const R = require("ramda")

const validator = require("../validator")
const utils = require("../../utils")

const naturalOrders = [
  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
]

const noMatcherFoundErrorString = `No natural matcher found for data. See supported sets below:

Full month names: January, February, March...
Short month names: Jan, Feb, Mar...
Full day names: Monday, Tuesday, Wednesday...
Short day names: Mon, Tue, Wed...`

module.exports = function(sortField, limit, combineRemainder, data) {
  let sorters = [R.descend(R.prop("count"))]
  if (sortField === "asc") sorters = [R.ascend(R.prop("count"))]
  if (sortField === "nameasc") sorters = [R.ascend(R.prop("name"))]
  if (sortField === "namedesc") sorters = [R.descend(R.prop("name"))]
  if (sortField === "pathdesc") sorters = [R.ascend(R.prop("path")), R.descend(R.prop("count"))]
  if (sortField === "pathasc") sorters = [R.ascend(R.prop("path")), R.ascend(R.prop("count"))]

  const keysAreNumbers = R.all(validator.isStringNumeric)(Object.keys(data))
  let totalCount = 0
  let formatted

  if (sortField === "natural") {
    const fieldsString = R.compose(R.join(""), R.sort(R.ascend(R.identity)), R.keys)(data)

    const matcher = R.find(function(orders) {
      return R.compose(R.join(""), R.sort(R.ascend(R.identity)))(orders) === fieldsString
    }, naturalOrders)

    if (matcher) {
      sorters = [function(a, b) {
        return matcher.indexOf(a.name) - matcher.indexOf(b.name)
      }]
    } else {
      return noMatcherFoundErrorString
    }
  }

  return R.pipe(
    R.toPairs,
    R.map(function(pair) {
      const path = R.compose(R.join(","), R.init, R.split(" - "))(pair[0])
      const name = (keysAreNumbers) ? parseFloat(pair[0]) : pair[0]
      return {name, path, count: pair[1]}
    }),
    R.tap(function(d) {
      formatted = d
    }),
    R.sortWith(sorters),
    R.take(limit || data.length),
    R.tap(function(d) {
      const set = (combineRemainder) ? formatted : d
      totalCount = R.compose(R.sum, R.pluck("count"))(set)
    }),
    R.when(R.always(combineRemainder), function(d) {
      const count = totalCount - R.compose(R.sum, R.pluck("count"))(d)
      return R.append({name: "Other", count}, d)
    }),
    R.map(function(row) {
      const percentage = utils.round(2, (row.count / totalCount) * 100)
      return R.compose(R.assoc("percentage", percentage), R.pick(["name", "count"]))(row)
    })
  )(data)
}
