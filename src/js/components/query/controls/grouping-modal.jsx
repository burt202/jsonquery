const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

function GroupingModal(props) {
  const onReset = () => {
    if (window.confirm("Are you sure you want to reset grouping options?")) {
      props.onGroupReducerChange(null)
      props.onDismiss()
    }
  }

  const onGroupReducerChange = e => {
    const groupReducer = e.target.value && e.target.value.length ? {name: e.target.value} : null
    props.onGroupReducerChange(groupReducer)
  }

  const onGroupReducerFieldChange = e => {
    if (e.target.value) props.onGroupReducerMetaChange({field: e.target.value})
  }

  const onGroupReducerValueChange = e => {
    if (e.target.value) props.onGroupReducerMetaChange({value: e.target.value})
  }

  const onSortChange = e => {
    props.onGroupSortChange(e.target.value)
  }

  const onLimitChange = e => {
    const groupLimit = e.target.value && e.target.value.length ? parseInt(e.target.value, 10) : null
    props.onGroupLimitChange(groupLimit)
  }

  const onCombineRemainderChange = () => {
    props.onCombineRemainderChange(!props.combineRemainder)
  }

  const getReducerValueInput = (fieldName, comparisonValue) => {
    const fieldType = props.schema[fieldName]

    if (fieldType === "bool") {
      return (
        <select onChange={onGroupReducerValueChange} value={comparisonValue}>
          <option value=""></option>
          <option value="true">is true</option>
          <option value="false">is false</option>
        </select>
      )
    }

    return (
      <span>
        <span style={{marginRight: "10px"}}>=</span>
        <input
          type="text"
          name="reducer-value"
          value={comparisonValue}
          onChange={onGroupReducerValueChange}
        />
      </span>
    )
  }

  const getReducerOption = () => {
    if (!props.groupings || !props.groupings.length) return null

    const reducerNameValue = props.groupReducer ? props.groupReducer.name : ""
    const reducerFieldValue =
      reducerNameValue.length && props.groupReducer.field ? props.groupReducer.field : ""
    const reducerValue =
      reducerNameValue.length && props.groupReducer.value ? props.groupReducer.value : ""

    const options = R.without(props.groupings, Object.keys(props.schema)).map(value => {
      return (
        <option value={value} key={value}>
          {value}
        </option>
      )
    })

    const conditionReducer =
      reducerNameValue === "countCondition" || reducerNameValue === "percentageCondition"

    return (
      <div className="input-control">
        <label>Reduce By:</label>
        <div className="body">
          <div className="row">
            <select onChange={onGroupReducerChange} value={reducerNameValue}>
              <option value=""></option>
              <option value="count">Length</option>
              <option value="percentage">Percentage</option>
              <option value="countCondition">Count Condition</option>
              <option value="percentageCondition">Percentage Condition</option>
            </select>
          </div>
          {conditionReducer && (
            <div className="row" style={{marginTop: "5px"}}>
              <select onChange={onGroupReducerFieldChange} value={reducerFieldValue}>
                <option></option>
                {options}
              </select>
              {reducerFieldValue && getReducerValueInput(reducerFieldValue, reducerValue)}
            </div>
          )}
        </div>
      </div>
    )
  }

  const getSortOptions = () => {
    let options = [
      {value: "desc", name: "Count DESC"},
      {value: "asc", name: "Count ASC"},
      {value: "namedesc", name: "Name DESC"},
      {value: "nameasc", name: "Name ASC"},
    ]

    if (props.groupings.length > 1) {
      options = options.concat([
        {value: "pathdesc", name: "Path DESC"},
        {value: "pathasc", name: "Path ASC"},
      ])
    }

    if (props.groupReducer) {
      options = options.concat([
        {value: "reducerdesc", name: "Reducer DESC"},
        {value: "reducerasc", name: "Reducer ASC"},
      ])
    }

    if (props.groupings.length === 1) {
      options = options.concat([{value: "natural", name: "Natural"}])
    }

    const disabled = !props.groupReducer

    return (
      <div className="input-control">
        <label>Sort By:</label>
        <div className="body">
          <div className="row">
            <select disabled={disabled} onChange={onSortChange} value={props.groupSort || ""}>
              {options.map(option => {
                return (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>
    )
  }

  const getLimitOptions = () => {
    const combineRemainderInput = props.groupLimit ? (
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="combineRemainder"
          checked={props.combineRemainder}
          onChange={onCombineRemainderChange}
        />
        Combine remainder
      </label>
    ) : null

    const disabled = !props.groupReducer

    return (
      <div className="input-control">
        <label>Limit By:</label>
        <div className="body">
          <div className="row">
            <select disabled={disabled} onChange={onLimitChange} value={props.groupLimit || ""}>
              <option value="">Show all</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
              <option value="250">250</option>
              <option value="500">500</option>
            </select>
            {combineRemainderInput}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="overlay" />
      <div className="modal">
        <div className="modal-content">
          <div className="modal-body">
            <h3>Grouping Options</h3>
            {getReducerOption()}
            {getSortOptions()}
            {getLimitOptions()}
          </div>
          <div className="modal-footer">
            <ul className="side-options right">
              {props.groupReducer && (
                <li>
                  <a className="site-link" onClick={onReset}>
                    Reset
                  </a>
                </li>
              )}
              <li>
                <a className="site-link" onClick={props.onDismiss}>
                  OK
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

GroupingModal.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  groupings: PropTypes.array,
  onGroupReducerChange: PropTypes.func.isRequired,
  onGroupReducerMetaChange: PropTypes.func.isRequired,
  onGroupSortChange: PropTypes.func.isRequired,
  onGroupLimitChange: PropTypes.func.isRequired,
  onCombineRemainderChange: PropTypes.func.isRequired,
  groupReducer: PropTypes.object,
  groupSort: PropTypes.string.isRequired,
  groupLimit: PropTypes.number,
  combineRemainder: PropTypes.bool.isRequired,
  schema: PropTypes.object.isRequired,
}

module.exports = GroupingModal
