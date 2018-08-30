module.exports = function(store) {
  return {
    saveJson(name, data) {
      store.dispatch({
        type: "saveJson",
        value: {name, data},
      })
    },

    saveCalculatedFields(calculatedFields) {
      store.dispatch({
        type: "saveCalculatedFields",
        value: {calculatedFields},
      })
    },

    saveCalculationsString(calculationsString) {
      store.dispatch({
        type: "saveCalculationsString",
        value: {calculationsString},
      })
    },

    addFilter(name) {
      store.dispatch({
        type: "addFilter",
        value: {name},
      })
    },

    deleteFilter(id) {
      store.dispatch({
        type: "deleteFilter",
        value: {id},
      })
    },

    toggleFilter(id, active) {
      store.dispatch({
        type: "updateFilter",
        value: {id, value: {active}},
      })
    },

    updateFilter(id, value) {
      store.dispatch({
        type: "updateFilter",
        value: {id, value},
      })
    },

    limit(number) {
      store.dispatch({
        type: "limit",
        value: {number},
      })
    },

    reset() {
      store.dispatch({
        type: "reset",
        value: {},
      })
    },

    addGrouping(name) {
      store.dispatch({
        type: "addGrouping",
        value: {name},
      })
    },

    removeGrouping(name) {
      store.dispatch({
        type: "removeGrouping",
        value: {name},
      })
    },

    addSorter(sorter) {
      store.dispatch({
        type: "addSorter",
        value: {sorter},
      })
    },

    removeSorter(name) {
      store.dispatch({
        type: "removeSorter",
        value: {name},
      })
    },

    analyse(name) {
      store.dispatch({
        type: "analyse",
        value: {name},
      })
    },

    updateResultFields(fields) {
      store.dispatch({
        type: "updateResultFields",
        value: {fields},
      })
    },

    showCounts(showCounts) {
      store.dispatch({
        type: "showCounts",
        value: {showCounts},
      })
    },

    groupSort(groupSort) {
      store.dispatch({
        type: "groupSort",
        value: {groupSort},
      })
    },

    groupLimit(groupLimit) {
      store.dispatch({
        type: "groupLimit",
        value: {groupLimit},
      })
    },

    combineRemainder(combineRemainder) {
      store.dispatch({
        type: "combineRemainder",
        value: {combineRemainder},
      })
    },

    showToast(toast) {
      store.dispatch({
        type: "updateToast",
        value: {toast},
      })
    },

    removeToast() {
      store.dispatch({
        type: "updateToast",
        value: {toast: undefined},
      })
    },
  }
}
