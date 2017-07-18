const R = require("ramda")
const uuid = require("uuid")

const createStore = require("./base")
const utils = require("../utils")

const defaults = {
  filters: [],
  groupings: [],
  sorters: [],
  calculatedFields: [],
  calculationsString: null,
  schema: null,
  data: null,
  resultFields: null,
  showCounts: false,
  groupSort: "desc",
  groupLimit: null,
  limit: null,
  analyse: null,
  combineRemainder: false,
}

const initialOperators = {
  string: "eq",
  number: "eq",
  bool: "nl",
  date: "eq",
  time: "eq",
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
    return R.merge(contents, R.omit([
      "data", "schema", "resultFields", "calculationsString", "calculatedFields",
    ], defaults))
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

    if (!toMerge.groupings.length) {
      toMerge.showCounts = false
      toMerge.groupSort = "desc"
      toMerge.groupLimit = null
      toMerge.combineRemainder = false
    }

    return R.merge(contents, toMerge)
  },

  analyse(contents, payload) {
    return R.merge(contents, {
      analyse: payload.name,
      groupings: [],
      showCounts: false,
      groupSort: "desc",
      groupLimit: null,
      combineRemainder: false,
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
      toMerge.combineRemainder = false
    }

    return R.merge(contents, toMerge)
  },

  groupSort(contents, payload) {
    return R.merge(contents, {
      groupSort: payload.groupSort,
    })
  },

  groupLimit(contents, payload) {
    const toMerge = {
      groupLimit: payload.groupLimit,
    }

    if (!payload.groupLimit) {
      toMerge.combineRemainder = false
    }

    return R.merge(contents, toMerge)
  },

  combineRemainder(contents, payload) {
    return R.merge(contents, {
      combineRemainder: payload.combineRemainder,
    })
  },

  saveCalculatedFields(contents, payload) {
    return R.merge(contents, {
      calculatedFields: payload.calculatedFields,
    })
  },

  saveCalculationsString(contents, payload) {
    return R.merge(contents, {
      calculationsString: payload.calculationsString,
    })
  },
}

module.exports = createStore(defaults, handlers)
