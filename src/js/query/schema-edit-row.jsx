const React = require("react")
const PropTypes = require("prop-types")

const {default: SelectField} = require("material-ui/SelectField")
const {MenuItem} = require("material-ui/Menu")

const SchemaEditRow = React.createClass({
  displayName: "SchemaEditRow",

  propTypes: {
    field: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  },

  onChange(e, index, value) {
    this.props.onChange(this.props.field, value)
  },

  render() {
    return <SelectField
      fullWidth
      floatingLabelText={this.props.field}
      onChange={this.onChange}
      value={this.props.type}
    >
      <MenuItem value="string" primaryText="String"/>
      <MenuItem value="number" primaryText="Number"/>
      <MenuItem value="bool" primaryText="Bool"/>
      <MenuItem value="date" primaryText="Date"/>
      <MenuItem value="array" primaryText="Array"/>
    </SelectField>
  },
})

module.exports = SchemaEditRow
