const React = require("react")
const useState = React.useState
const PropTypes = require("prop-types")

const R = require("ramda")

const GroupingModal = require("./grouping-modal")

function GroupingControl(props) {
  const [state, setState] = useState({
    modalOpen: false,
  })

  const onAdd = e => {
    props.onAdd(e.target.value)
  }

  const getRows = () => {
    return props.groupings.map(function(grouping) {
      return (
        <div className="row" key={grouping}>
          <div className="grouping">
            {grouping}
            <a className="site-link" onClick={() => props.onRemove(grouping)}>
              remove
            </a>
          </div>
        </div>
      )
    })
  }

  const getGroupingModal = () => {
    if (!state.modalOpen) return null

    return (
      <GroupingModal
        onDismiss={closeModal}
        onGroupReducerChange={props.onGroupReducerChange}
        onGroupReducerMetaChange={props.onGroupReducerMetaChange}
        onGroupSortChange={props.onGroupSortChange}
        onGroupLimitChange={props.onGroupLimitChange}
        onCombineRemainderChange={props.onCombineRemainderChange}
        groupings={props.groupings}
        groupReducer={props.groupReducer}
        groupSort={props.groupSort}
        groupLimit={props.groupLimit}
        combineRemainder={props.combineRemainder}
        schema={props.schema}
      />
    )
  }

  const showModal = () => {
    document.body.classList.toggle("modal-open")
    setState({modalOpen: true})
  }

  const closeModal = () => {
    document.body.classList.toggle("modal-open")
    setState({modalOpen: false})
  }

  const getGroupingOptionsLink = () => {
    if (!props.groupings.length) return null
    return (
      <div>
        <a className="site-link" onClick={showModal}>
          Grouping options
        </a>
      </div>
    )
  }

  const options = R.without(props.groupings, Object.keys(props.schema)).map(function(value) {
    return (
      <option value={value} key={value}>
        {value}
      </option>
    )
  })

  return (
    <div className="input-control">
      <label>Group By:</label>
      <div className="body">
        {getRows()}
        <div className="row">
          <select onChange={onAdd} value="">
            <option></option>
            {options}
          </select>
        </div>
      </div>
      {getGroupingOptionsLink()}
      {getGroupingModal()}
    </div>
  )
}

GroupingControl.propTypes = {
  groupings: PropTypes.array,
  schema: PropTypes.object.isRequired,
  groupReducer: PropTypes.object,
  groupSort: PropTypes.string.isRequired,
  groupLimit: PropTypes.number,
  combineRemainder: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onGroupReducerChange: PropTypes.func.isRequired,
  onGroupReducerMetaChange: PropTypes.func.isRequired,
  onGroupSortChange: PropTypes.func.isRequired,
  onGroupLimitChange: PropTypes.func.isRequired,
  onCombineRemainderChange: PropTypes.func.isRequired,
}

module.exports = GroupingControl
