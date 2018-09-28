const R = require("ramda")

module.exports = function(sorters, data) {
  return R.sortWith(R.map(function(sorter) {
    const direction = (sorter.direction === "asc") ? "ascend" : "descend"
    return R[direction](R.prop(sorter.field))
  }, sorters), data)
}
