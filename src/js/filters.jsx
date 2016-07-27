var React = require("react");

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

var Filters = React.createClass({
  displayName: "Filters",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    schema: React.PropTypes.object.isRequired
  },

  getInputControlByType: function (type, name, value) {
    if (typeMap[type]) {
      return typeMap[type].bind(this)(name, value, this.updateFilter);
    } else {
      return "Invalid Type"
    }
  },

  getFilterRows: function () {
    if (this.props.filters.length) {
      return this.props.filters.map(function (filter) {
        return (
          <tr key={filter.name}>
            <td>{filter.name}</td>
            <td>{this.getInputControlByType(this.props.schema[filter.name], filter.name, filter.value)}</td>
            <td><a className="site-link" onClick={this.deleteFilter} data-name={filter.name}>Remove</a></td>
          </tr>
        );
      }.bind(this));
    } else {
      return (<tr><td>No filters</td></tr>);
    }
  },

  deleteFilter: function (e) {
    this.props.actionCreator.deleteFilter(e.target.dataset.name);
  },

  updateFilter: function (name, e) {
    this.props.actionCreator.updateFilter(name, e.target.value);
  },

  render: function () {
    return (
      <div>
      <h3>Filters and Grouping</h3>
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
      </div>
    );
  }
});

module.exports = Filters;
