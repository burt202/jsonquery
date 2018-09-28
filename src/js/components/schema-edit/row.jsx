const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const SchemaEditRow = createReactClass({
  displayName: "SchemaEditRow",

  propTypes: {
    field: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  },

  onChange(e) {
    this.props.onChange(this.props.field, e.target.value)
  },

  onRemove() {
    this.props.onRemove(this.props.field)
  },

  render() {
    return (
      <tr key={this.props.field}>
        <td>{this.props.field}</td>
        <td>
          <select value={this.props.type} onChange={this.onChange}>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="bool">Bool</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
            <option value="array">Array</option>
          </select>
        </td>
        <td><a className="site-link" onClick={this.onRemove}>Remove</a></td>
      </tr>
    )
  },
})

module.exports = SchemaEditRow
