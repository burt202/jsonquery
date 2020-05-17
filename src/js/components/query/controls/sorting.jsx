const React = require("react")
const PropTypes = require("prop-types")
const useState = React.useState

const initialState = {
  field: null,
  direction: null,
}

function SortingControl(props) {
  const [state, setState] = useState(initialState)

  const onChange = (e, prop) => {
    const toSet = {}
    toSet[prop] = e.target.value

    setState(toSet, function() {
      if (state.field !== null && state.direction !== null) {
        props.onAdd(state)
        setState(initialState)
      }
    })
  }

  const getRows = () => {
    return props.sorters.map(function(sorter) {
      return (
        <div className="row" key={sorter.field}>
          <div className="sorter">
            {sorter.field} - {sorter.direction.toUpperCase()}
            <a className="site-link" onClick={() => props.onRemove(sorter.field)}>
              remove
            </a>
          </div>
        </div>
      )
    })
  }

  const options = props.options.map(function(value) {
    return (
      <option value={value} key={value}>
        {value}
      </option>
    )
  })

  return (
    <div className="input-control">
      <label>Sort By:</label>
      <div className="body">
        {getRows()}
        <div className="row">
          <select onChange={e => onChange(e, "field")} value={state.field || ""}>
            <option></option>
            {options}
          </select>
          <select onChange={e => onChange(e, "direction")} value={state.direction || ""}>
            <option></option>
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>
      </div>
    </div>
  )
}

SortingControl.propTypes = {
  sorters: PropTypes.array,
  options: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

module.exports = SortingControl
