const React = require("react")
const PropTypes = require("prop-types")

function SchemaEditRow(props) {
  const onChange = e => {
    props.onChange(props.field, e.target.value)
  }

  const onRemove = () => {
    props.onRemove(props.field)
  }

  return (
    <tr key={props.field}>
      <td>{props.field}</td>
      <td>
        <select value={props.type} onChange={onChange}>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="bool">Bool</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="array">Array</option>
        </select>
      </td>
      <td>
        <a className="site-link" onClick={onRemove}>
          Remove
        </a>
      </td>
    </tr>
  )
}

SchemaEditRow.propTypes = {
  field: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

module.exports = SchemaEditRow
