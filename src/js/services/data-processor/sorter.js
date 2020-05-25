const R = require("ramda")

module.exports = (sorters, data) => {
  return R.sortWith(
    R.map(sorter => {
      const direction = sorter.direction === "asc" ? "ascend" : "descend"
      return R[direction](R.prop(sorter.field))
    }, sorters),
    data,
  )
}
