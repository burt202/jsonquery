const R = require("ramda")
const createStore = require("./helpers/store-base")

const defaults = {
  filters: [],
  groupBy: null,
  sortBy: null,
  sortDirection: "asc",
  schema: null,
  data: null,
  resultFields: null,
}

function updateWhere(find, update, data) {
  const index = R.findIndex(R.whereEq(find), data)
  return R.adjust(R.merge(R.__, update), index, data)
}

const initialOperators = {
  string: "eq",
  int: "eq",
  date: "eq",
  bool: "nl",
}

const handlers = {
  saveJson: function(contents, payload) {
    const toUpdate = {}
    toUpdate[payload.name] = payload.data
    return R.merge(contents, toUpdate)
  },

  updateResultFields: function(contents, payload) {
    return R.merge(contents, {
      resultFields: payload.fields,
    })
  },

  addFilter: function(contents, payload) {
    const filterType = (contents.schema || {})[payload.name] || "string"
    const operator = initialOperators[filterType] || "eq"

    return R.merge(contents, {
      filters: R.append({name: payload.name, value: "", operator: operator}, contents.filters),
    })
  },

  deleteFilter: function(contents, payload) {
    return R.merge(contents, {
      filters: R.reject(R.propEq("name", payload.name), contents.filters),
    })
  },

  updateFilter: function(contents, payload) {
    return R.merge(contents, {
      filters: updateWhere({name: payload.name}, payload.value, contents.filters),
    })
  },

  reset: function(contents) {
    return R.merge(contents, {
      filters: [],
      groupBy: null,
      sortBy: null,
      sortDirection: "asc",
    })
  },

  groupBy: function(contents, payload) {
    return R.merge(contents, {
      groupBy: payload.name,
      sortBy: null,
    })
  },

  sortBy: function(contents, payload) {
    return R.merge(contents, {
      groupBy: null,
      sortBy: payload.name,
    })
  },

  sortDirection: function(contents, payload) {
    return R.merge(contents, {
      sortDirection: payload.direction,
    })
  },

  goBack: function(contents) {
    return R.merge(contents, defaults)
  },
}

module.exports = createStore(defaults, handlers)
