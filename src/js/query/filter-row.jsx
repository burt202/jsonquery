const React = require("react")
const PropTypes = require("prop-types")
const R = require("ramda")

const {default: SelectField} = require("material-ui/SelectField")
const {default: MenuItem} = require("material-ui/MenuItem")
const {default: TextField} = require("material-ui/TextField")
const {default: Toggle} = require("material-ui/Toggle")
const {default: IconButton} = require("material-ui/IconButton")
const {default: RemoveIcon} = require("material-ui/svg-icons/content/remove-circle")

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
    type: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  },

  getInputControlByType() {
    if (!filterConfig[this.props.type]) return "Invalid Type"

    const options = filterConfig[this.props.type].map(function(option) {
      return <MenuItem
        key={option.value}
        value={option.value}
        primaryText={option.text}
      />
    })

    let inputs = []
    const selectedOperator = R.find(R.propEq("value", this.props.filter.operator), filterConfig[this.props.type])

    if (selectedOperator && selectedOperator.inputs) {
      inputs = selectedOperator.inputs.map(function(inputConfig, index) {
        const inc = (index) ? index : ""

        return React.createElement(TextField, R.merge({
          fullWidth: true,
          key: this.props.filter.id + inc,
          name: this.props.filter.id + inc,
          value: this.props.filter[`value${inc}`] || "",
          onChange: this.updateFilterText.bind(this, `value${inc}`),
        }, inputConfig))
      }.bind(this))
    }

    return (
      <div style={{position: "relative"}}>
        <div style={{opacity: this.props.filter.active ? 1 : 0.5}}>
          <div style={{display: "flex", alignItems: "flex-end"}}>
            <SelectField
              fullWidth
              name={this.props.filter.id}
              value={this.props.filter.operator}
              onChange={this.updateFilter.bind(this, "operator")}
              floatingLabelText={this.props.filter.name}
            >
              {options}
            </SelectField>
            <Toggle
              toggled={this.props.filter.active}
              onToggle={this.toggleFilter}
              style={{width: "initial", marginBottom: 12}}
            />
          <IconButton onTouchTap={this.deleteFilter} style={{padding: 0, width: 24, height: 24, marginLeft: 8, marginBottom: 12}}>
              <RemoveIcon color="#aaa" hoverColor="#444"/>
            </IconButton>
          </div>
          {inputs}
        </div>
      </div>
    )
  },

  toggleFilter() {
    this.props.onToggle(this.props.filter.id, !this.props.filter.active)
  },

  deleteFilter() {
    this.props.onDelete(this.props.filter.id)
  },

  updateFilter(prop, e, index, value) {
    const toUpdate = {}
    toUpdate[prop] = value
    this.props.onUpdate(this.props.filter.id, toUpdate)
  },

  updateFilterText(prop, e, value) {
    const toUpdate = {}
    toUpdate[prop] = value
    this.props.onUpdate(this.props.filter.id, toUpdate)
  },

  render() {
    // const toggleClass = (this.props.filter.active) ? "active" : "inactive"

    return <div>
      {this.getInputControlByType()}
    </div>

    // return (
    //   <tr key={this.props.filter.id} className={toggleClass}>
    //     <td>{this.getInputControlByType()}</td>
    //     <td><a className="site-link" onClick={this.toggleFilter}>Toggle</a></td>
    //     <td><a className="site-link" onClick={this.deleteFilter}>Remove</a></td>
    //   </tr>
    // )
  },
})

module.exports = FilterRow
