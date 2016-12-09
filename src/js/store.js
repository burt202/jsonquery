var R = require("ramda");
var createStore = require("./helpers/store-base");

var defaults = {
  filters: [],
  groupBy: null,
  sortBy: null,
  sortDirection: "asc",
  schema: null,
  data: null
};

function updateWhere(find, update, data) {
  var index = R.findIndex(R.whereEq(find), data);
  return R.adjust(R.merge(R.__, update), index, data);
}

var initialOperators = {
  string: "eq",
  int: "eq",
  date: "eq"
}

var handlers = {
  saveJson: function (contents, payload) {
    var toUpdate = {};
    toUpdate[payload.name] = payload.data;
    return R.merge(contents, toUpdate);
  },

  addFilter: function (contents, payload) {
    var filterType = (contents.schema || {})[payload.name] || "string"
    var operator = initialOperators[filterType] || "eq"

    return R.merge(contents, {
      filters: R.append({name: payload.name, value: "", operator: operator}, contents.filters)
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
      groupBy: payload.name,
      sortBy: null
    });
  },

  sortBy: function (contents, payload) {
    return R.merge(contents, {
      groupBy: null,
      sortBy: payload.name
    });
  },

  sortDirection: function (contents, payload) {
    return R.merge(contents, {
      sortDirection: payload.direction
    });
  },

  goBack: function (contents) {
    return R.merge(contents, defaults);
  }
};

module.exports = createStore(defaults, handlers);
