const React = require("react")

const SchemaEditRow = React.createClass({
  displayName: "SchemaEditRow",

  propTypes: {
    field: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },

  onChange: function(e) {
    this.props.onChange(this.props.field, e.target.value)
  },

  render: function() {
    return (
      <tr key={this.props.field}>
        <td>{this.props.field}</td>
        <td>
          <select value={this.props.type} onChange={this.onChange}>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="bool">Bool</option>
            <option value="date">Date</option>
            <option value="array">Array</option>
          </select>
        </td>
      </tr>
    )
  },
})

module.exports = SchemaEditRow
