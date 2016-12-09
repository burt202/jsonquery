const dispatcher = require("./helpers/dispatcher")

module.exports = {
  saveJson: function(name, data) {
    dispatcher.dispatch({
      name: "saveJson",
      value: {name: name, data: data},
    })
  },

  addFilter: function(name) {
    dispatcher.dispatch({
      name: "addFilter",
      value: {name: name},
    })
  },

  deleteFilter: function(name) {
    dispatcher.dispatch({
      name: "deleteFilter",
      value: {name: name},
    })
  },

  updateFilter: function(name, value) {
    dispatcher.dispatch({
      name: "updateFilter",
      value: {name: name, value: value},
    })
  },

  reset: function() {
    dispatcher.dispatch({
      name: "reset",
      value: {},
    })
  },

  groupBy: function(name) {
    dispatcher.dispatch({
      name: "groupBy",
      value: {name: name},
    })
  },

  sortBy: function(name) {
    dispatcher.dispatch({
      name: "sortBy",
      value: {name: name},
    })
  },

  sortDirection: function(direction) {
    dispatcher.dispatch({
      name: "sortDirection",
      value: {direction: direction},
    })
  },

  goBack: function() {
    dispatcher.dispatch({
      name: "goBack",
      value: {},
    })
  },
}
