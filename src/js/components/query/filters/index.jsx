const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const FilterRow = require("./row")

function Filters(props) {
  const [state, setState] = useState({
    lastFilteredAddedAt: null,
  })

  const onAddFilter = e => {
    setState({lastFilteredAddedAt: Date.now()})
    props.actionCreator.addFilter(e.target.value)
  }

  const getFilterControl = () => {
    const options = Object.keys(props.schema).map(function(value) {
      return (
        <option value={value} key={value}>
          {value}
        </option>
      )
    })

    return (
      <div className="input-control">
        <label>Add Filter:</label>
        <div className="body">
          <div className="row">
            <select onChange={onAddFilter} key={state.lastFilteredAddedAt}>
              <option></option>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  }

  const getFilterRows = () => {
    if (!props.filters.length)
      return (
        <tr>
          <td>No filters</td>
        </tr>
      )

    return props.filters.map(function(filter) {
      return (
        <FilterRow
          key={filter.id}
          filter={filter}
          type={props.schema[filter.name]}
          onToggle={props.actionCreator.toggleFilter}
          onUpdate={props.actionCreator.updateFilter}
          onDelete={props.actionCreator.deleteFilter}
        />
      )
    })
  }

  return (
    <div>
      <h3>Filters</h3>
      <table className="table filters">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{getFilterRows()}</tbody>
      </table>
      {getFilterControl()}
    </div>
  )
}

Filters.propTypes = {
  actionCreator: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
}

module.exports = Filters
