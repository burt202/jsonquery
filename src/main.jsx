var React = require("react");
var ReactDOM = require("react-dom");
var R = require("ramda");

var actionCreator = require("./action-creator");
var store = require("./store");

require("./app.css");

function getStringInput (name, value, onChange) {
  return (<input type="text" name={name} value={value} onChange={onChange.bind(this, name)} />);
}

function getIntInput (name, value, onChange) {
  return (<input type="number" name={name} value={value} onChange={onChange.bind(this, name)} />);
}

function getBoolInput (name, value, onChange) {
  return (
    <select name={name} value={value} onChange={onChange.bind(this, name)}>
      <option value="">NULL</option>
      <option value="true">TRUE</option>
      <option value="false">FALSE</option>
    </select>
  );
}

var typeMap = {
  string: getStringInput,
  int: getIntInput,
  bool: getBoolInput
};

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

  onAddFilter: function (e) {
    actionCreator.addFilter(e.target.value);
  },

  onDeleteFilter: function (e) {
    actionCreator.deleteFilter(e.target.dataset.name);
  },

  updateFilterValue: function (name, e) {
    actionCreator.updateFilter(name, e.target.value);
  },

  getInputControlByType: function (type, name, value) {
    if (typeMap[type]) {
      return typeMap[type].bind(this)(name, value, this.updateFilterValue);
    } else {
      return "Invalid Type"
    }
  },

  getFilterRows: function () {
    if (this.state.filters.length) {
      return this.state.filters.map(function (filter) {
        return (
          <tr key={filter.name}>
            <td>{filter.name}</td>
            <td>{this.getInputControlByType(this.state.schema[filter.name], filter.name, filter.value)}</td>
            <td><a href="#" onClick={this.onDeleteFilter} data-name={filter.name}>Remove</a></td>
          </tr>
        );
      }.bind(this));
    } else {
      return (<tr><td>No filters</td></tr>);
    }
  },

  onReset: function () {
    actionCreator.reset();
  },

  getEmptyRow: function () {
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

  onGroupByChange: function (e) {
    actionCreator.groupBy(e.target.value);
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

  filterData: function () {
    var filters = R.reduce(function (acc, filter) {
      var type = this.state.schema[filter.name];
      if (type === "string") acc[filter.name] = R.equals(filter.value);
      if (type === "int") acc[filter.name] = R.equals(parseInt(filter.value, 10));
      if (type === "bool") {
        if (filter.value === "true") acc[filter.name] = R.equals(true);
        if (filter.value === "false") acc[filter.name] = R.equals(false);
        if (filter.value === "") acc[filter.name] = R.isNil;
      }
      return acc;
    }.bind(this), {}, this.state.filters);

    return R.filter(R.where(filters), this.state.data);
  },

  groupData: function (filtered) {
    if (this.state.groupBy) {
      return R.groupBy(R.prop(this.state.groupBy), filtered);
    } else {
      return filtered;
    }
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

  onFileUpload: function (name, evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = function () {
      var json = JSON.parse(reader.result);
      actionCreator.saveJson(name, json);
    }.bind(this);

    reader.readAsText(file);
  },

  getUploadInputs: function () {
    return (
      <div>
        Schema: <input type="file" onChange={this.onFileUpload.bind(this, "schema")} />
        Data: <input type="file" onChange={this.onFileUpload.bind(this, "data")} />
      </div>
    );
  },

  render: function () {
    if (!this.state.schema || !this.state.data) {
      return this.getUploadInputs();
    } else {
      var filtered = this.filterData();
      var grouped = this.groupData(filtered);

      return (
        <div>
          {this.getEmptyRow()}
          <table className="table filters">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.getFilterRows()}
            </tbody>
          </table>
          {this.getGroupByControl()}
          <p><a href="#" onClick={this.onReset}>Reset</a></p>
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
