const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

function IncludeFields(props) {
  const isAggregateResult = () => {
    return props.groupReducer || props.analyse
  }

  const onChangeHandler = e => {
    const field = e.target.name
    const isPresent = R.contains(field, props.resultFields)
    const updatedFields = isPresent
      ? R.without([field], props.resultFields)
      : R.append(field, props.resultFields)

    props.actionCreator.updateResultFields(updatedFields)
  }

  const getResultFieldOptions = () => {
    const schemaKeys = R.sortBy(R.identity, R.keys(props.schema))

    return schemaKeys.map(field => {
      const checked = R.contains(field, props.resultFields)
      const disabled = R.contains(field, props.groupings)

      return (
        <label className="checkbox-label" key={field}>
          <input
            type="checkbox"
            name={field}
            disabled={disabled}
            checked={checked}
            onChange={onChangeHandler}
          />
          {field}
        </label>
      )
    })
  }

  const unSelectResultFields = () => {
    props.actionCreator.updateResultFields(props.groupings)
  }

  const selectResultFields = () => {
    props.actionCreator.updateResultFields(R.keys(props.schema))
  }

  if (isAggregateResult()) return null

  return (
    <div className="include-fields-cont">
      <h3>Include</h3>
      <div>
        <span>{getResultFieldOptions()}</span>
        <p>
          <a className="site-link" style={{marginRight: "15px"}} onClick={unSelectResultFields}>
            Unselect All
          </a>
          <a className="site-link" onClick={selectResultFields}>
            Select All
          </a>
        </p>
      </div>
    </div>
  )
}

IncludeFields.propTypes = {
  groupings: PropTypes.array,
  resultFields: PropTypes.array.isRequired,
  schema: PropTypes.object.isRequired,
  actionCreator: PropTypes.object.isRequired,
  groupReducer: PropTypes.object,
  analyse: PropTypes.string,
}

module.exports = IncludeFields
