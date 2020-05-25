const React = require("react")
const PropTypes = require("prop-types")

const R = require("ramda")

function AnalyseControl(props) {
  const onChange = e => {
    props.onChange(e.target.value)
  }

  const getOptions = () => {
    const numberOptions = R.pipe(R.toPairs, R.map(R.prop(0)))(props.schema)

    return numberOptions.map(value => {
      return (
        <option value={value} key={value}>
          {value}
        </option>
      )
    })
  }

  return (
    <div className="input-control">
      <label>Analyse:</label>
      <div className="body">
        <div className="row">
          <select onChange={onChange} value={props.value || ""}>
            <option></option>
            {getOptions()}
          </select>
        </div>
      </div>
    </div>
  )
}

AnalyseControl.propTypes = {
  value: PropTypes.string,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

module.exports = AnalyseControl
