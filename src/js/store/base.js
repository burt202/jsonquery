const dispatcher = require("./dispatcher")
const EventEmitter = require("events").EventEmitter
const R = require("ramda")

const CHANGE_EVENT = "change"

module.exports = function(defaults, handlers) {

  let contents = defaults

  const store = R.mergeAll([{}, EventEmitter.prototype, {

    resetState() {
      contents = defaults
    },

    setState(state) {
      contents = state
    },

    getState() {
      return contents
    },

    emitChange() {
      this.emit(CHANGE_EVENT)
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback)
    },

    removeChangeListener(callback) {
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
