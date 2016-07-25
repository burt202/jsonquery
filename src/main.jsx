var React = require("react");
var ReactDOM = require("react-dom");
var R = require("ramda");

var actionCreator = require("./action-creator");
var store = require("./store");

var formatter = require("./formatter");
var Upload = require("./upload");
var Filters = require("./filters");

require("./app.css");

var Main = React.createClass({
  getInitialState: function () {
    return store.getState();
  },

  componentDidMount: function () {
    store.addChangeListener(this.update);
  },

  componentWillUnmount: function () {
    store.removeChangeListener(this.update);
  },

  update: function () {
    this.setState(store.getState());
  },

  onAddFilter: function (e) {
    actionCreator.addFilter(e.target.value);
  },

  onGroupByChange: function (e) {
    actionCreator.groupBy(e.target.value);
  },

  onReset: function () {
    actionCreator.reset();
  },

  getFilterOptions: function () {
    var filterOptions = R.pipe(
      R.keys,
      R.without(R.pluck("name", this.state.filters))
    )(this.state.schema);

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
    return Object.keys(this.state.schema).map(function (value) {
      return (
        <option value={value} key={value}>{value}</option>
      );
    });
  },

  getGroupByControl: function () {
    return (
      <div className="input-control">
        <span>Group By:</span>
        <select onChange={this.onGroupByChange} value={this.state.groupBy || ""}>
          <option></option>
          {this.getGroupByOptions()}
        </select>
      </div>
    );
  },

  getResetControl: function () {
    return (
      <p><a href="#" onClick={this.onReset}>Reset</a></p>
    );
  },

  showSummary: function (filtered, grouped) {
    var formattedGroups = "None";

    if (this.state.groupBy) {
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
    if (!this.state.schema || !this.state.data) {
      return <Upload
        actionCreator={actionCreator}
      />
    } else {
      var filtered = formatter.filter(this.state.data, this.state.schema, this.state.filters);
      var grouped = formatter.group(filtered, this.state.groupBy);

      return (
        <div>
          {this.getFilterControl()}
          <Filters
            actionCreator={actionCreator}
            filters={this.state.filters}
            schema={this.state.schema}
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
  }
});

ReactDOM.render(<Main />, document.body.querySelector(".main"));
