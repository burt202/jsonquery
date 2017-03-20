const React = require("react")
const R = require("ramda")

const defaultInput = {}
const dateInput = {placeholder: "YYYYMMDD", maxLength: 8}
const separateWithCommaInput = {placeholder: "separate with comma"}
const regexInput = {placeholder: "enter regex here"}

const filterConfig = {
  string: [
    {text: "Equal to", value: "eq", inputs: [defaultInput]},
    {text: "Not equal to", value: "neq", inputs: [defaultInput]},
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
    {text: "Is one of", value: "iof", inputs: [separateWithCommaInput]},
    {text: "Is not one of", value: "inof", inputs: [separateWithCommaInput]},
    {text: "Matches", value: "rgm", inputs: [regexInput]},
  ],
  int: [
    {text: "Equal to", value: "eq", inputs: [defaultInput]},
    {text: "Not equal to", value: "neq", inputs: [defaultInput]},
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
    {text: "Greater than", value: "gt", inputs: [defaultInput]},
    {text: "Greater than or equal to", value: "gte", inputs: [defaultInput]},
    {text: "Less than", value: "lt", inputs: [defaultInput]},
    {text: "Less than or equal to", value: "lte", inputs: [defaultInput]},
    {text: "Is one of", value: "iof", inputs: [separateWithCommaInput]},
    {text: "Is not one of", value: "inof", inputs: [separateWithCommaInput]},
  ],
  bool: [
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
    {text: "Is true", value: "true"},
    {text: "Is false", value: "false"},
  ],
  date: [
    {text: "Is same day as", value: "eq", inputs: [dateInput]},
    {text: "Is before", value: "be", inputs: [dateInput]},
    {text: "Is after", value: "af", inputs: [dateInput]},
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
  ],
  array: [
    {text: "Contains String", value: "cos", inputs: [defaultInput]},
    {text: "Contains Number", value: "con", inputs: [defaultInput]},
    {text: "Has length of", value: "hl", inputs: [defaultInput]},
    {text: "Doesnt Have length of", value: "dhl", inputs: [defaultInput]},
    {text: "Has length greater than", value: "hlgt", inputs: [defaultInput]},
    {text: "Has length greater than or equal to", value: "hlgte", inputs: [defaultInput]},
    {text: "Has length less than", value: "hllt", inputs: [defaultInput]},
    {text: "Has length less than or equal to", value: "hllte", inputs: [defaultInput]},
  ],
}

const Filters = React.createClass({
  displayName: "Filters",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    schema: React.PropTypes.object.isRequired,
  },

  getInputControlByType: function(type, filter) {
    if (!filterConfig[type]) return "Invalid Type"

    const options = filterConfig[type].map(function(option) {
      return <option key={option.value} value={option.value}>{option.text}</option>
    })

    var inputs = []
    const selectedOperator = R.find(R.propEq("value", filter.operator), filterConfig[type])

    if (selectedOperator && selectedOperator.inputs) {
      inputs = selectedOperator.inputs.map(function(inputConfig) {
        return React.createElement("input", R.merge({
          key: filter.name,
          type: "text",
          name: filter.name,
          value: filter.value,
          onChange: this.updateFilter.bind(this, filter.name, "value"),
        }, inputConfig))
      }.bind(this))
    }

    return (
      <div className="filter-controls">
        <select name={filter.name} value={filter.operator} onChange={this.updateFilter.bind(this, filter.name, "operator")}>
          {options}
        </select>
        {inputs}
      </div>
    )
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
