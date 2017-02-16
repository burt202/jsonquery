const React = require("react")

const placeholderMap = {
  "iof": "separate with comma",
  "inof": "separate with comma",
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
        <option value="inof">Is not one of</option>
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
        <option value="lte">Less than or equal to</option>
        <option value="iof">Is one of</option>
        <option value="inof">Is not one of</option>
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

function getArrayInput(filter, onChange) {
  return (
    <div className="filter-controls">
      <select name={filter.name} value={filter.operator} onChange={onChange.bind(this, filter.name, "operator")}>
        <option value="cos">Contains String</option>
        <option value="con">Contains Number</option>
        <option value="hl">Has length of</option>
        <option value="hlgt">Has length greater than</option>
        <option value="hlgte">Has length greater than or equal to</option>
        <option value="hllt">Has length less than</option>
        <option value="hllte">Has length less than or equal to</option>
      </select>
      <input type="text" name={filter.name} value={filter.value} onChange={onChange.bind(this, filter.name, "value")} />
    </div>
  )
}

const typeMap = {
  string: getStringInput,
  int: getIntInput,
  bool: getBoolInput,
  date: getDateInput,
  array: getArrayInput,
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
    if (!this.props.filters.length)
      return (
        <tr><td>No filters</td></tr>
      )

    return this.props.filters.map(function(filter) {
      const toggleClass = (filter.active) ? "active" : "inactive"

      return (
        <tr key={filter.name} className={toggleClass}>
          <td>{filter.name}</td>
          <td>{this.getInputControlByType(this.props.schema[filter.name], filter)}</td>
          <td><a className="site-link" onClick={this.toggleFilter} data-name={filter.name} data-active={filter.active}>Toggle</a></td>
          <td><a className="site-link" onClick={this.deleteFilter} data-name={filter.name}>Remove</a></td>
        </tr>
      )
    }.bind(this))
  },

  toggleFilter: function(e) {
    const name = e.target.dataset.name
    const active = e.target.dataset.active === "true"
    this.props.actionCreator.toggleFilter(name, !active)
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
