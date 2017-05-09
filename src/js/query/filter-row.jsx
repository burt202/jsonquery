const React = require("react")
const R = require("ramda")
const classNames = require("classnames")

const defaultInput = {}
const dateInput = {placeholder: "YYYYMMDD", maxLength: 8}
const dateTimeInput = {placeholder: "YYYYMMDD (hhmm)", maxLength: 13}
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
  number: [
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
    {text: "Is between", value: "btw", inputs: [defaultInput, defaultInput]},
  ],
  bool: [
    {text: "Is null", value: "nl"},
    {text: "Is not null", value: "nnl"},
    {text: "Is true", value: "true"},
    {text: "Is false", value: "false"},
  ],
  date: [
    {text: "Equal to", value: "eq", inputs: [defaultInput]},
    {text: "Not equal to", value: "neq", inputs: [defaultInput]},
    {text: "Is same day as", value: "sd", inputs: [dateInput]},
    {text: "Is before", value: "be", inputs: [dateTimeInput]},
    {text: "Is after", value: "af", inputs: [dateTimeInput]},
    {text: "Is between", value: "btw", inputs: [dateTimeInput, dateTimeInput]},
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

const FilterRow = React.createClass({
  displayName: "FilterRow",

  propTypes: {
    type: React.PropTypes.string.isRequired,
    filter: React.PropTypes.object.isRequired,
    onToggle: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
  },

  getInputControlByType: function() {
    if (!filterConfig[this.props.type]) return "Invalid Type"

    const options = filterConfig[this.props.type].map(function(option) {
      return <option key={option.value} value={option.value}>{option.text}</option>
    })

    var inputs = []
    const selectedOperator = R.find(R.propEq("value", this.props.filter.operator), filterConfig[this.props.type])

    if (selectedOperator && selectedOperator.inputs) {
      inputs = selectedOperator.inputs.map(function(inputConfig, index) {
        const inc = (index) ? index : ""

        return React.createElement("input", R.merge({
          key: this.props.filter.id + inc,
          type: "text",
          name: this.props.filter.id + inc,
          value: this.props.filter["value" + inc] || "",
          onChange: this.updateFilter.bind(this, "value" + inc),
        }, inputConfig))
      }.bind(this))
    }

    const classnames = classNames("filter-controls", this.props.type)

    return (
      <div className={classnames}>
        <select
          name={this.props.filter.id}
          value={this.props.filter.operator}
          onChange={this.updateFilter.bind(this, "operator")}
        >
          {options}
        </select>
        <div className="inputs">
          {inputs}
        </div>
      </div>
    )
  },

  toggleFilter: function() {
    this.props.onToggle(this.props.filter.id, !this.props.filter.active)
  },

  deleteFilter: function() {
    this.props.onDelete(this.props.filter.id)
  },

  updateFilter: function(prop, e) {
    const toUpdate = {}
    toUpdate[prop] = e.target.value
    this.props.onUpdate(this.props.filter.id, toUpdate)
  },

  render: function() {
    const toggleClass = (this.props.filter.active) ? "active" : "inactive"

    return (
      <tr key={this.props.filter.id} className={toggleClass}>
        <td>{this.props.filter.name}</td>
        <td>{this.getInputControlByType()}</td>
        <td><a className="site-link" onClick={this.toggleFilter}>Toggle</a></td>
        <td><a className="site-link" onClick={this.deleteFilter}>Remove</a></td>
      </tr>
    )
  },
})

module.exports = FilterRow
