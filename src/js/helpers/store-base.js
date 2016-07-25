var dispatcher = require("./dispatcher");
var EventEmitter = require("events").EventEmitter;
var R = require("ramda");

var CHANGE_EVENT = "change";

module.exports = function (defaults, handlers) {

  var contents = defaults;

  var store = R.mergeAll([{}, EventEmitter.prototype, {

    getState: function () {
      return contents;
    },

    emitChange: function () {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
  }]);

  dispatcher.register(function (action) {
    if (!handlers[action.name]) return;
    contents = handlers[action.name](contents, action.value);
    store.emitChange();
  });

  return store;
};
