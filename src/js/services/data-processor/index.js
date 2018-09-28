const R = require("ramda")

const filter = require("./filter")
const sort = require("./sorter")
const grouper = require("./grouper")
const groupProcessor = require("./group-processor")

module.exports = {
  filter,
  sort,
  limit(limit, data) {
    return R.take(this.props.limit, data)
  },
  group: grouper,
  groupProcessor,
}
