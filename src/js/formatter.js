var R = require("ramda");

module.exports = {
  filter: function (data, schema, filters) {
    var builtFilters = R.reduce(function (acc, filter) {
      var type = schema[filter.name];
      if (type === "string") acc[filter.name] = R.equals(filter.value);
      if (type === "int") acc[filter.name] = R.equals(parseInt(filter.value, 10));
      if (type === "bool") {
        if (filter.value === "true") acc[filter.name] = R.equals(true);
        if (filter.value === "false") acc[filter.name] = R.equals(false);
        if (filter.value === "") acc[filter.name] = R.isNil;
      }
      return acc;
    }.bind(this), {}, filters);

    return R.filter(R.where(builtFilters), data);
  },

  group: function (filtered, groupBy) {
    return R.groupBy(R.prop(groupBy), filtered);
  }
};
