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

var round = R.curry(function (decimals, num) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
});

var isOneOf = R.curry(function(filterValue, dataValue) {
  dataValue = (dataValue) ? dataValue.toString() : "";
  return R.compose(R.contains(dataValue), R.split(","), R.defaultTo(""))(filterValue);
});

function getMax (arr) {
  return Math.max.apply(null, arr);
}

function getMin (arr) {
  return Math.min.apply(null, arr);
}

var getMode = R.compose(
  R.map(parseInt),
  R.map(R.head),
  R.defaultTo([]),
  R.converge(R.prop, [
    R.compose(R.last, R.sortBy(parseInt), R.keys),
    R.identity
  ]),
  R.groupBy(R.last),
  R.toPairs,
  R.countBy(R.identity)
);

module.exports = {
  filter: function (data, schema, filters) {
    var builtFilters = R.reduce(function (acc, filter) {
      var type = schema[filter.name];

      if (type === "string") {
        if (filter.operator === "eq") acc[filter.name] = R.equals(filter.value);
        if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(filter.value));
        if (filter.operator === "nl") acc[filter.name] = R.isNil;
        if (filter.operator === "iof") acc[filter.name] = isOneOf(filter.value);
      }

      if (type === "int") {
        if (filter.operator === "eq") acc[filter.name] = R.equals(parseInt(filter.value, 10));
        if (filter.operator === "neq") acc[filter.name] = R.compose(R.not, R.equals(parseInt(filter.value, 10)));
        if (filter.operator === "nl") acc[filter.name] = R.isNil;
        if (filter.operator === "gt") acc[filter.name] = R.gt(R.__, parseInt(filter.value, 10));
        if (filter.operator === "lt") acc[filter.name] = R.lt(R.__, parseInt(filter.value, 10));
        if (filter.operator === "gte") acc[filter.name] = R.gte(R.__, parseInt(filter.value, 10));
        if (filter.operator === "lte") acc[filter.name] = R.lte(R.__, parseInt(filter.value, 10));
        if (filter.operator === "iof") acc[filter.name] = isOneOf(filter.value);
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
  },

  sort: function (filtered, sortBy, sortDirection) {
    var sorted = R.sortBy(R.prop(sortBy), filtered);
    if (sortDirection == "desc") return R.reverse(sorted);
    return sorted;
  },

  getGroupStats: function (grouped) {
    var groupLengths = R.pipe(
      R.toPairs,
      R.map(function (pair) {
        return pair[1].length;
      })
    )(grouped);

    var count = {name: "Count", value: Object.keys(grouped).length};
    var max = {name: "Max Size", value: getMax(groupLengths)};
    var min = {name: "Min Size", value: getMin(groupLengths)};
    var mean = {name: "Mean Size", value: R.compose(round(2), R.mean)(groupLengths)};
    var median = {name: "Median Size", value: R.compose(round(2), R.median)(groupLengths)};
    var mode = {name: "Mode Size", value: getMode(groupLengths).join(", ")};

    var stats = {count: count};

    return (count.value) ? R.merge(stats, {
      max: max,
      min: min,
      mean: mean,
      median: median,
      mode: mode
    }) : stats;
  }
};
