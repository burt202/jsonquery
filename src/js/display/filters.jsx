const React = require("react")

const placeholderMap = {
  "iof": "separate with comma",
  "rgm": "enter regex here",
}

function getStringInput(filter, onChange) {
  const placeholder = placeholderMap[filter.operator] || ""

  return (
    <div className="filter-controls">
      <select name={filter.name} value={filter.operator} onChange={onChange.bind(this, filter.name, "operator")}>
        <option value="eq">Equal to</option>
        <option value="neq">Not equal to</option>
        <option value="nl">Is null</option>
        <option value="nnl">Is not null</option>
        <option value="iof">Is one of</option>
        <option value="rgm">Matches</option>
      </select>
      <input type="text" name={filter.name} value={filter.value} placeholder={placeholder} onChange={onChange.bind(this, filter.name, "value")} />
    </div>
  )
}

function getIntInput(filter, onChange) {
  const placeholder = placeholderMap[filter.operator] || ""

  return (
    <div className="filter-controls">
      <select name={filter.name} value={filter.operator} onChange={onChange.bind(this, filter.name, "operator")}>
        <option value="eq">Equal to</option>
        <option value="neq">Not equal to</option>
        <option value="nl">Is null</option>
        <option value="nnl">Is not null</option>
        <option value="gt">Greater than</option>
        <option value="gte">Greater than or equal to</option>
        <option value="lt">Less than</option>
        <option value="iof">Is one of</option>
      </select>
      <input type="text" name={filter.name} value={filter.value} placeholder={placeholder} onChange={onChange.bind(this, filter.name, "value")} />
    </div>
  )
}

function getBoolInput(filter, onChange) {
  return (
    <div className="filter-controls">
      <select name={filter.name} value={filter.operator} onChange={onChange.bind(this, filter.name, "operator")}>
        <option value="nl">Is null</option>
        <option value="true">Is true</option>
        <option value="false">Is false</option>
      </select>
    </div>
  )
}

function getDateInput(filter, onChange) {
  return (
    <div className="filter-controls">
      <select name={filter.name} value={filter.operator} onChange={onChange.bind(this, filter.name, "operator")}>
        <option value="eq">Is same day</option>
        <option value="be">Is before</option>
        <option value="af">Is after</option>
        <option value="nl">Is null</option>
        <option value="nnl">Is not null</option>
      </select>
      <input type="text" name={filter.name} value={filter.value} placeholder="YYYYMMDD" maxLength="8" onChange={onChange.bind(this, filter.name, "value")} />
    </div>
  )
}

const typeMap = {
  string: getStringInput,
  int: getIntInput,
  bool: getBoolInput,
  date: getDateInput,
}

const Filters = React.createClass({
  displayName: "Filters",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    schema: React.PropTypes.object.isRequired,
  },

  getInputControlByType: function(type, filter) {
    if (typeMap[type]) return typeMap[type].bind(this)(filter, this.updateFilter)
    return "Invalid Type"
  },

  getFilterRows: function() {
    if (this.props.filters.length) {
      return this.props.filters.map(function(filter) {
        return (
          <tr key={filter.name}>
            <td>{filter.name}</td>
            <td>{this.getInputControlByType(this.props.schema[filter.name], filter)}</td>
            <td><a className="site-link" onClick={this.deleteFilter} data-name={filter.name}>Remove</a></td>
          </tr>
        )
      }.bind(this))
    }

    return (<tr><td>No filters</td></tr>)
  },

  deleteFilter: function(e) {
    this.props.actionCreator.deleteFilter(e.target.dataset.name)
  },

  updateFilter: function(name, prop, e) {
    const toUpdate = {}
    toUpdate[prop] = e.target.value
    this.props.actionCreator.updateFilter(name, toUpdate)
  },

  render: function() {
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
    )
  },
})

module.exports = Filters
