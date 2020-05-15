const R = require("ramda")

const validator = require("../validator")

const naturalOrders = [
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
]

const noMatcherFoundErrorString = `No natural matcher found for data. See supported sets below:

Full month names: January, February, March...
Short month names: Jan, Feb, Mar...
Full day names: Monday, Tuesday, Wednesday...
Short day names: Mon, Tue, Wed...`

module.exports = function(sortField, data) {
  if (!sortField) return data

  let sorters = [R.descend(R.prop("count"))]
  if (sortField === "asc") sorters = [R.ascend(R.prop("count"))]
  if (sortField === "nameasc") sorters = [R.ascend(R.prop("name"))]
  if (sortField === "namedesc") sorters = [R.descend(R.prop("name"))]
  if (sortField === "pathdesc") sorters = [R.ascend(R.prop("path")), R.descend(R.prop("count"))]
  if (sortField === "pathasc") sorters = [R.ascend(R.prop("path")), R.ascend(R.prop("count"))]
  if (sortField === "reducerdesc") sorters = [R.descend(R.prop("reducer"))]
  if (sortField === "reducerasc") sorters = [R.ascend(R.prop("reducer"))]

  if (sortField === "natural") {
    const fieldsString = R.compose(R.join(""), R.sort(R.ascend(R.identity)), R.keys)(data)

    const matcher = R.find(function(orders) {
      return R.compose(R.join(""), R.sort(R.ascend(R.identity)))(orders) === fieldsString
    }, naturalOrders)

    if (matcher) {
      sorters = [
        function(a, b) {
          return matcher.indexOf(a.name) - matcher.indexOf(b.name)
        },
      ]
    } else {
      return noMatcherFoundErrorString
    }
  }

  const keysAreNumbers = R.all(validator.isStringNumeric)(Object.keys(data))

  return R.pipe(
    R.toPairs,
    R.map(function(pair) {
      const path = R.compose(R.join(","), R.init, R.split(" - "))(pair[0])
      const name = keysAreNumbers ? parseFloat(pair[0]) : pair[0]
      const count = pair[1].count
      const reducer = pair[1].reducer
      return {name, path, count, reducer}
    }),
    R.sortWith(sorters),
    R.map(R.omit(["path", "count"])),
  )(data)
}
