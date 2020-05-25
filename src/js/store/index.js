const R = require("ramda")
const {applyMiddleware, createStore} = require("redux")

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
  groupReducer: null,
  groupSort: "desc",
  groupLimit: null,
  limit: null,
  analyse: null,
  combineRemainder: false,
  toast: undefined,
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
  _resetState() {
    return defaults
  },

  _setState(contents, payload) {
    return Object.assign({}, payload)
  },

  saveJson(contents, payload) {
    const toUpdate = R.omit(
      ["data", "schema", "resultFields", "calculationsString", "calculatedFields"],
      defaults,
    )
    toUpdate[payload.name] = payload.data

    if (payload.name === "schema") {
      toUpdate.resultFields = R.keys(payload.data)
    }

    return {...contents, ...toUpdate}
  },

  updateResultFields(contents, payload) {
    return {...contents, resultFields: payload.fields}
  },

  addFilter(contents, payload) {
    const filterType = (contents.schema || {})[payload.name] || "string"
    const operator = initialOperators[filterType] || "eq"

    return {
      ...contents,
      filters: R.append(
        {id: Date.now().toString(), name: payload.name, value: "", operator, active: true},
        contents.filters,
      ),
    }
  },

  deleteFilter(contents, payload) {
    return {...contents, filters: R.reject(R.propEq("id", payload.id), contents.filters)}
  },

  updateFilter(contents, payload) {
    return {
      ...contents,
      filters: utils.updateWhere({id: payload.id}, payload.value, contents.filters),
    }
  },

  limit(contents, payload) {
    return {...contents, limit: payload.number}
  },

  reset(contents) {
    const toOmit = R.omit(
      ["data", "schema", "resultFields", "calculationsString", "calculatedFields"],
      defaults,
    )
    return {...contents, ...toOmit}
  },

  addGrouping(contents, payload) {
    return {
      ...contents,
      analyse: null,
      groupings: R.append(payload.name, contents.groupings),
      resultFields: R.compose(R.uniq, R.append(payload.name))(contents.resultFields),
    }
  },

  removeGrouping(contents, payload) {
    const toMerge = {
      groupings: R.without([payload.name], contents.groupings || []),
    }

    if (!toMerge.groupings.length) {
      toMerge.groupReducer = null
      toMerge.groupSort = "desc"
      toMerge.groupLimit = null
      toMerge.combineRemainder = false
    }

    return {...contents, ...toMerge}
  },

  analyse(contents, payload) {
    return {
      ...contents,
      analyse: payload.name,
      groupings: [],
      groupReducer: null,
      groupSort: "desc",
      groupLimit: null,
      combineRemainder: false,
      resultFields: Object.keys(contents.schema || {}),
    }
  },

  addSorter(contents, payload) {
    return {...contents, sorters: R.append(payload.sorter, contents.sorters)}
  },

  removeSorter(contents, payload) {
    return {...contents, sorters: R.reject(R.propEq("field", payload.name), contents.sorters)}
  },

  groupReducer(contents, payload) {
    const toMerge = {
      groupReducer: payload.groupReducer,
    }

    if (!toMerge.groupReducer) {
      toMerge.groupSort = "desc"
      toMerge.groupLimit = null
      toMerge.combineRemainder = false
    }

    return {...contents, ...toMerge}
  },

  groupReducerMeta(contents, payload) {
    const toMerge = {
      groupReducer: {...contents.groupReducer, ...payload.groupReducerMeta},
    }

    return {...contents, ...toMerge}
  },

  groupSort(contents, payload) {
    return {...contents, groupSort: payload.groupSort}
  },

  groupLimit(contents, payload) {
    const toMerge = {
      groupLimit: payload.groupLimit,
    }

    if (!payload.groupLimit) {
      toMerge.combineRemainder = false
    }

    return {...contents, ...toMerge}
  },

  combineRemainder(contents, payload) {
    return {...contents, combineRemainder: payload.combineRemainder}
  },

  saveCalculatedFields(contents, payload) {
    return {...contents, calculatedFields: payload.calculatedFields}
  },

  saveCalculationsString(contents, payload) {
    return {...contents, calculationsString: payload.calculationsString}
  },

  updateToast(contents, payload) {
    return {...contents, toast: payload.toast}
  },
}

function reducers(contents, action) {
  if (!contents) contents = defaults
  if (!handlers[action.type]) return contents
  return handlers[action.type](contents, action.value)
}

const middlewares = []

if (process.env.NODE_ENV !== "production") {
  const {createLogger} = require("redux-logger")
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error,
  })

  middlewares.push(logger)
}

module.exports = createStore(reducers, applyMiddleware.apply(this, middlewares))
