const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const R = require("ramda")

const SchemaEditRow = require("./row")

function SchemaEditRows(props) {
  const [state, setState] = useState({
    schema: props.schema,
    fieldName: "",
  })

  const onChangeExisting = (field, type) => {
    setState({
      ...state,
      schema: R.assoc(field, type, state.schema),
    })
  }

  const onRemoveExisting = field => {
    setState({
      ...state,
      schema: R.dissoc(field, state.schema),
    })
  }

  const onSave = () => {
    props.onAction(state.schema)
  }

  const getSchemaRows = () => {
    return R.toPairs(state.schema).map(function(pair) {
      return (
        <SchemaEditRow
          key={pair[0]}
          field={pair[0]}
          type={pair[1]}
          onChange={onChangeExisting}
          onRemove={onRemoveExisting}
        />
      )
    })
  }

  const onInputChange = e => {
    setState({
      ...state,
      fieldName: e.target.value,
    })
  }

  const onSelectChange = e => {
    setState({
      schema: R.assoc(state.fieldName, e.target.value, state.schema),
      fieldName: "",
    })
  }

  return (
    <div>
      <div className="rows">
        <table className="table">
          <tbody>
            {getSchemaRows()}
            <tr>
              <td>
                <input
                  value={state.fieldName}
                  placeholder="Add new field..."
                  onChange={onInputChange}
                />
              </td>
              <td colSpan="2">
                <select value="" disabled={!state.fieldName.length} onChange={onSelectChange}>
                  <option value=""></option>
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="bool">Bool</option>
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                  <option value="array">Array</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={onSave}>Save</button>
    </div>
  )
}

SchemaEditRows.propTypes = {
  schema: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
}

module.exports = SchemaEditRows
