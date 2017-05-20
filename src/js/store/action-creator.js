const R = require("ramda")
const dispatcher = require("./dispatcher")

module.exports = {
  saveJson(name, data) {
    dispatcher.dispatch({
      name: "saveJson",
      value: {name, data},
    })

    if (name === "schema") {
      dispatcher.dispatch({
        name: "updateResultFields",
        value: {fields: R.keys(data)},
      })
    }
  },

  addFilter(name) {
    dispatcher.dispatch({
      name: "addFilter",
      value: {name},
    })
  },

  deleteFilter(id) {
    dispatcher.dispatch({
      name: "deleteFilter",
      value: {id},
    })
  },

  toggleFilter(id, active) {
    dispatcher.dispatch({
      name: "updateFilter",
      value: {id, value: {active}},
    })
  },

  updateFilter(id, value) {
    dispatcher.dispatch({
      name: "updateFilter",
      value: {id, value},
    })
  },

  limit(number) {
    dispatcher.dispatch({
      name: "limit",
      value: {number},
    })
  },

  reset() {
    dispatcher.dispatch({
      name: "reset",
      value: {},
    })
  },

  addGrouping(name) {
    dispatcher.dispatch({
      name: "addGrouping",
      value: {name},
    })
  },

  removeGrouping(name) {
    dispatcher.dispatch({
      name: "removeGrouping",
      value: {name},
    })
  },

  addSorter(sorter) {
    dispatcher.dispatch({
      name: "addSorter",
      value: {sorter},
    })
  },

  removeSorter(name) {
    dispatcher.dispatch({
      name: "removeSorter",
      value: {name},
    })
  },

  sum(name) {
    dispatcher.dispatch({
      name: "sum",
      value: {name},
    })
  },

  average(name) {
    dispatcher.dispatch({
      name: "average",
      value: {name},
    })
  },

  updateResultFields(fields) {
    dispatcher.dispatch({
      name: "updateResultFields",
      value: {fields},
    })
  },

  showCounts(showCounts) {
    dispatcher.dispatch({
      name: "showCounts",
      value: {showCounts},
    })
  },
}
