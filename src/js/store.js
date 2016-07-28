var R = require("ramda");
var createStore = require("./helpers/store-base");

var defaults = {
  filters: [],
  groupBy: null,
  schema: null,
  data: null
};

function updateWhere(find, update, data) {
  var index = R.findIndex(R.whereEq(find), data);
  return R.adjust(R.merge(R.__, update), index, data);
}

var handlers = {
  saveJson: function (contents, payload) {
    var toUpdate = {};
    toUpdate[payload.name] = payload.data;
    return R.merge(contents, toUpdate);
  },

  addFilter: function (contents, payload) {
    return R.merge(contents, {
      filters: R.append({name: payload.name, value: "", operator: "eq"}, contents.filters)
    });
  },

  deleteFilter: function (contents, payload) {
    return R.merge(contents, {
      filters: R.reject(R.propEq("name", payload.name), contents.filters)
    });
  },

  updateFilter: function (contents, payload) {
    return R.merge(contents, {
      filters: updateWhere({name: payload.name}, payload.value, contents.filters)
    });
  },

  reset: function (contents) {
    return R.merge(contents, {
      filters: [],
      groupBy: null
    });
  },

  groupBy: function (contents, payload) {
    return R.merge(contents, {
      groupBy: payload.name
    });
  },

  goBack: function (contents) {
    return R.merge(contents, defaults);
  }
};

module.exports = createStore(defaults, handlers);
