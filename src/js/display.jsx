var React = require("react");
var R = require("ramda");

var formatter = require("./formatter");
var Filters = require("./filters");

var Display = React.createClass({
  displayName: "Display",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    schema: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired
  },

  onAddFilter: function (e) {
    this.props.actionCreator.addFilter(e.target.value);
  },

  onGroupByChange: function (e) {
    this.props.actionCreator.groupBy(e.target.value);
  },

  onReset: function () {
    this.props.actionCreator.reset();
  },

  onBackClick: function () {
    this.props.actionCreator.goBack();
  },

  getFilterOptions: function () {
    var filterOptions = R.pipe(
      R.keys,
      R.without(R.pluck("name", this.props.filters))
    )(this.props.schema);

    return filterOptions.map(function (value) {
      return (
        <option value={value} key={value}>{value}</option>
      );
    });
  },

  getFilterControl: function () {
    return (
      <div className="input-control">
        <span>Add Filter:</span>
        <select onChange={this.onAddFilter}>
          <option></option>
          {this.getFilterOptions()}
        </select>
      </div>
    );
  },

  getGroupByOptions: function () {
    return Object.keys(this.props.schema).map(function (value) {
      return (
        <option value={value} key={value}>{value}</option>
      );
    });
  },

  getGroupByControl: function () {
    return (
      <div className="input-control">
        <span>Group By:</span>
        <select onChange={this.onGroupByChange} value={this.props.groupBy || ""}>
          <option></option>
          {this.getGroupByOptions()}
        </select>
      </div>
    );
  },

  getResetControl: function () {
    return (
      <p><a className="site-link" onClick={this.onReset}>Reset</a></p>
    );
  },

  showSummary: function (filtered, grouped) {
    var formattedGroups = "None";

    if (this.props.groupBy) {
      var groups = Object.keys(grouped).map(function (key) {
        return key + " (" + grouped[key].length + ")";
      });

      formattedGroups = groups.join(", ");
    }

    return (
      <div>
        <h3>Summary</h3>
        <p>Total: {filtered.length}</p>
        <p>Groups: {formattedGroups}</p>
      </div>
    );
  },

  render: function () {
    var filtered = formatter.filter(this.props.data, this.props.schema, this.props.filters);
    var grouped = formatter.group(filtered, this.props.groupBy);

    return (
      <div>
        <p><a className="site-link" onClick={this.onBackClick}>Back</a></p>
        {this.getFilterControl()}
        <Filters
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
        />
        {this.getGroupByControl()}
        {this.getResetControl()}
        {this.showSummary(filtered, grouped)}
        <div>
          <h3>Results</h3>
          <pre>{JSON.stringify(grouped, null, 2)}</pre>
        </div>
      </div>
    )
  }
});

module.exports = Display;
