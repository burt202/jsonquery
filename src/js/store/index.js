const R = require("ramda")
const uuid = require("uuid")

const createStore = require("./base")
const utils = require("../utils")

const defaults = {
  filters: [],
  groupings: [],
  sorters: [],
  schema: null,
  data: null,
  resultFields: null,
  showCounts: false,
  flatten: false,
  groupSort: "desc",
  groupLimit: null,
  limit: null,
  analyse: null,
}

const initialOperators = {
  string: "eq",
  number: "eq",
  date: "eq",
  bool: "nl",
  array: "cos",
}

const handlers = {
  saveJson(contents, payload) {
    const toUpdate = R.omit(["data", "schema", "resultFields"], defaults)
    toUpdate[payload.name] = payload.data
    return R.merge(contents, toUpdate)
  },

  updateResultFields(contents, payload) {
    return R.merge(contents, {
      resultFields: payload.fields,
    })
  },

  addFilter(contents, payload) {
    const filterType = (contents.schema || {})[payload.name] || "string"
    const operator = initialOperators[filterType] || "eq"

    return R.merge(contents, {
      filters: R.append({id: uuid.v4(), name: payload.name, value: "", operator, active: true}, contents.filters),
    })
  },

  deleteFilter(contents, payload) {
    return R.merge(contents, {
      filters: R.reject(R.propEq("id", payload.id), contents.filters),
    })
  },

  updateFilter(contents, payload) {
    return R.merge(contents, {
      filters: utils.updateWhere({id: payload.id}, payload.value, contents.filters),
    })
  },

  limit(contents, payload) {
    return R.merge(contents, {
      limit: payload.number,
    })
  },

  reset(contents) {
    return R.merge(contents, R.omit(["data", "schema", "resultFields"], defaults))
  },

  addGrouping(contents, payload) {
    return R.merge(contents, {
      analyse: null,
      groupings: R.append(payload.name, contents.groupings),
      resultFields: R.compose(R.uniq, R.append(payload.name))(contents.resultFields),
    })
  },

  removeGrouping(contents, payload) {
    const toMerge = {
      groupings: R.without([payload.name], contents.groupings || []),
    }

    if (toMerge.groupings.length <= 1) toMerge.flatten = false
    if (!toMerge.groupings.length) {
      toMerge.showCounts = false
      toMerge.groupSort = "desc"
      toMerge.groupLimit = null
    }

    return R.merge(contents, toMerge)
  },

  analyse(contents, payload) {
    return R.merge(contents, {
      analyse: payload.name,
      groupings: [],
      showCounts: false,
      flatten: false,
      groupSort: "desc",
      groupLimit: null,
    })
  },

  addSorter(contents, payload) {
    return R.merge(contents, {
      sorters: R.append(payload.sorter, contents.sorters),
    })
  },

  removeSorter(contents, payload) {
    return R.merge(contents, {
      sorters: R.reject(R.propEq("field", payload.name), contents.sorters),
    })
  },

  showCounts(contents, payload) {
    const toMerge = {
      showCounts: payload.showCounts,
    }

    if (!toMerge.showCounts) {
      toMerge.groupSort = "desc"
      toMerge.groupLimit = null
    }

    return R.merge(contents, toMerge)
  },

  flatten(contents, payload) {
    const toMerge = {
      flatten: payload.flatten,
    }

    if (!toMerge.flatten) {
      toMerge.groupSort = "desc"
      toMerge.groupLimit = null
    }

    return R.merge(contents, toMerge)
  },

  groupSort(contents, payload) {
    return R.merge(contents, {
      groupSort: payload.groupSort,
    })
  },

  groupLimit(contents, payload) {
    return R.merge(contents, {
      groupLimit: payload.groupLimit,
    })
  },
}

module.exports = createStore(defaults, handlers)
