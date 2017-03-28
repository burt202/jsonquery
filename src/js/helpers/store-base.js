const dispatcher = require("./dispatcher")
const EventEmitter = require("events").EventEmitter
const R = require("ramda")

const CHANGE_EVENT = "change"

module.exports = function(defaults, handlers) {

  var contents = defaults

  const store = R.mergeAll([{}, EventEmitter.prototype, {

    resetState: function() {
      contents = defaults
    },

    setState: function(state) {
      contents = state
    },

    getState: function() {
      return contents
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT)
    },

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback)
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback)
    },
  }])

  dispatcher.register(function(action) {
    if (!handlers[action.name]) return
    contents = handlers[action.name](contents, action.value)
    store.emitChange()
  })

  return store
}
