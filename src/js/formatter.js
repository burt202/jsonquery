var R = require("ramda");
var moment = require("moment");

var isSame = R.curry(function (filterValue, dataValue) {
  return moment(dataValue).isSame(filterValue, "day");
});

var isBefore = R.curry(function (filterValue, dataValue) {
  return moment(dataValue).isBefore(filterValue);
});

var isAfter = R.curry(function (filterValue, dataValue) {
  return moment(dataValue).isAfter(filterValue);
});

module.exports = {
  filter: function (data, schema, filters) {
    var builtFilters = R.reduce(function (acc, filter) {
      var type = schema[filter.name];

      if (type === "string") {
        if (filter.operator === "eq") acc[filter.name] = R.equals(filter.value);
        if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(filter.value));
        if (filter.operator === "nl") acc[filter.name] = R.isNil;
      }

      if (type === "int") {
        if (filter.operator === "eq") acc[filter.name] = R.equals(parseInt(filter.value, 10));
        if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(parseInt(filter.value, 10)));
        if (filter.operator === "nl") acc[filter.name] = R.isNil;
        if (filter.operator === "gt") acc[filter.name] = R.gt(R.__, parseInt(filter.value, 10));
        if (filter.operator === "lt") acc[filter.name] = R.lt(R.__, parseInt(filter.value, 10));
        if (filter.operator === "gte") acc[filter.name] = R.gte(R.__, parseInt(filter.value, 10));
        if (filter.operator === "lte") acc[filter.name] = R.lte(R.__, parseInt(filter.value, 10));
      }

      if (type === "bool") {
        if (filter.value === "true") acc[filter.name] = R.equals(true);
        if (filter.value === "false") acc[filter.name] = R.equals(false);
        if (filter.value === "") acc[filter.name] = R.isNil;
      }

      if (type === "date") {
        if (filter.value.length === 8 && moment(filter.value, "YYYYMMDD").isValid()) {
          if (filter.operator === "eq") acc[filter.name] = isSame(filter.value);
          if (filter.operator === "be") acc[filter.name] = isBefore(filter.value);
          if (filter.operator === "at") acc[filter.name] = isAfter(filter.value);
        }

        if (filter.operator === "nl") acc[filter.name] = R.isNil;
      }

      return acc;
    }.bind(this), {}, filters);

    return R.filter(R.where(builtFilters), data);
  },

  group: function (filtered, groupBy) {
    return R.groupBy(R.prop(groupBy), filtered);
  }
};
